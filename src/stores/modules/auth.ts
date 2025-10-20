/*
 * @Author: shen
 * @Date: 2025-05-28 14:28:18
 * @LastEditors: shen
 * @LastEditTime: 2025-10-19 18:42:55
 * @Description:
 */
import type { MenuData, MenuRecordRaw, UserData } from '@/typings'
import type { ComputedRef, Ref } from 'vue'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LOGIN_PATH, VITE_APP_NAME, VITE_APP_STORAGE_ENCRYPE } from '@/shared/constants'
import { authLoginApi, getAuthMenuList, getAuthUserInfo } from '@/api'
import { localCache } from '@/shared/cache'
import { mapTree, toTree } from '@/shared/utils'
import { useRouter } from 'vue-router'
import { preferences } from '@/shared/preferences'
import { notification } from 'ant-design-vue'
import { resetAllStores, useTabbarStore } from '../'
import { $t } from '@/locales'
import config from '@/config'

type AccessToken = null | string

interface AuthState {
  /**
   * @zh_CN 登录 accessToken
   */
  accessToken: Ref<AccessToken>

  /**
   * @zh_CN 是否已经检查过权限
   */
  isAccessChecked: Ref<boolean>

  /**
   * @zh_CN 登录的用户信息
   */
  userInfo: Ref<UserData | null | undefined>

  /**
   * @zh_CN 可访问的菜单列表
   */
  originMenus: Ref<MenuData[]>

  /**
   * @zh_CN 可访问的菜单树形列表
   */
  accessMenus: ComputedRef<MenuRecordRaw[]>
  /**
   * 是否锁屏状态
   */
  isLockScreen: Ref<boolean>
  /**
   * 锁屏密码
   */
  lockScreenPassword: Ref<string | undefined>
  /**
   * 登录是否过期
   */
  loginExpired: Ref<boolean>
  /**
   * 登录加载动画
   */
  loginLoading: Ref<boolean>
  /**
   * 登录 accessToken
   */
  refreshToken: Ref<AccessToken>
  /**
   * @zh_CN 设置登录 accessToken
   */
  setAccessToken: (value: AccessToken) => void

  /**
   * @zh_CN 设置登录 refreshToken
   */
  setRefreshToken(token: AccessToken): void
  /**
   * @zh_CN 设置是否已经检查过权限
   */
  setIsAccessChecked: (value: boolean) => void

  /**
   * @zh_CN 设置登录用户信息
   */
  setUserInfo(data: UserData): void

  /**
   * @zh_CN 设置可访问的菜单列表
   */
  setAccessMenus(data: MenuData[]): void
  /**
   * @zh_CN 获取登录用户信息
   */
  fetchUserInfo(): Promise<UserData | null>

  /**
   * @zh_CN 获取访问的菜单列表
   */
  fetchAccessMenus(): Promise<MenuData[]>

  /**
   * @zh_CN 设置登录过期
   */
  setLoginExpired(expired: boolean): void
  /**
   * @zh_CN 锁屏
   */
  lockScreen(password: string): void
  unlockScreen(): void
  authLogin(params: Recordable<any>, onSuccess?: () => Promise<void> | void): Promise<void>
  authCodeLogin(params: Recordable<any>, onSuccess?: () => Promise<void> | void): Promise<void>
  logout(redirect?: boolean): Promise<void>
}

export const useAuthStore = defineStore<string, AuthState>(
  'auth',
  () => {
    const router = useRouter()
    const accessToken = ref<AccessToken>(null)
    const userInfo = ref<UserData | null>(null)
    const originMenus = ref<MenuData[]>([])
    const loginLoading = ref(false)
    const isAccessChecked = ref(false)
    const isLockScreen = ref(false)
    const loginExpired = ref(false)
    const lockScreenPassword = ref<string | undefined>(undefined)
    const refreshToken = ref<AccessToken>(null)
    const tabbarStore = useTabbarStore()
    const accessMenus = computed(() => {
      const menus = originMenus.value
        .filter((menu) => !menu.hideInMenu)
        .sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999))
      const treeMenus = toTree(menus, '0')
      return mapTree(treeMenus, (item) => {
        // 确保菜单名称不为空
        const title = (item.title || item.name || '') as string
        const path =
          item.microUrl && VITE_APP_NAME !== item.appName
            ? `/${item.appName}${item.path}`
            : item.path
        const resultChildren = item.hideChildrenInMenu
          ? []
          : ((item.children as MenuRecordRaw[]) ?? [])

        if (resultChildren.length > 0) {
          resultChildren.forEach((child) => {
            child.parents = [...(item.parents ?? []), path]
            child.parent = path
          })
        }
        // 确定最终路径
        const resultPath = item.hideChildrenInMenu ? item.redirect || path : item.link || path

        return {
          key: resultPath,
          label: title,
          title,
          icon: item.icon,
          activeIcon: item.activeIcon,
          parent: item.parent,
          parents: item.parents,
          path: resultPath,
          children: resultChildren?.length ? resultChildren : undefined,
        } as MenuRecordRaw
      })
    })

    function setAccessToken(value: AccessToken) {
      accessToken.value = value
    }

    function setIsAccessChecked(value: boolean) {
      isAccessChecked.value = value
    }

    function setUserInfo(data: UserData) {
      userInfo.value = data
    }

    function setAccessMenus(data: MenuData[]) {
      originMenus.value = data
    }

    function setLoginExpired(expired: boolean) {
      loginExpired.value = expired
    }

    function setRefreshToken(token: AccessToken) {
      refreshToken.value = token
    }

    function lockScreen(password: string) {
      isLockScreen.value = true
      lockScreenPassword.value = password
    }

    function unlockScreen() {
      isLockScreen.value = false
      lockScreenPassword.value = undefined
    }

    async function fetchUserInfo() {
      try {
        const { code, data } = await getAuthUserInfo()
        if (code === 200) {
          setUserInfo(data)
          return data
        }
        return null
      } catch (_) {
        return null
      }
    }

    async function fetchAccessMenus() {
      try {
        const { code, data } = await getAuthMenuList()
        if (code === 200) {
          setAccessMenus(data)
          return data
        }
        return []
      } catch (_) {
        return []
      }
    }

    /**
     * 异步处理登录操作
     * Asynchronously handle the login process
     * @param params 登录表单数据
     */
    async function authLogin(params: Recordable<any>, onSuccess?: () => Promise<void> | void) {
      // 异步处理用户登录操作并获取 accessToken
      try {
        loginLoading.value = true
        const { code, data } = await authLoginApi(params)
        const accessToken = data?.accessToken
        // 如果成功获取到 accessToken
        if (code === 200 && accessToken) {
          setAccessToken(accessToken)

          if (loginExpired.value) {
            setLoginExpired(false)
            tabbarStore.refresh(router)
          } else {
            onSuccess
              ? await onSuccess?.()
              : await router.push(data?.homePath || preferences.app.defaultHomePath)
          }

          if (data?.realName) {
            notification.success({
              description: `${$t('authentication.loginSuccessDesc')}:${data?.realName}`,
              duration: 3,
              message: $t('authentication.loginSuccess'),
            })
          }
        }
      } finally {
        loginLoading.value = false
      }
    }

    async function authCodeLogin(params: Recordable<any>, onSuccess?: () => Promise<void> | void) {
      // 异步处理用户登录操作并获取 accessToken
      try {
        loginLoading.value = true
        const { code, data } = await authLoginApi(params)
        const accessToken = data?.accessToken
        // 如果成功获取到 accessToken
        if (code === 200 && accessToken) {
          setAccessToken(accessToken)

          if (loginExpired.value) {
            setLoginExpired(false)
          } else {
            onSuccess
              ? await onSuccess?.()
              : await router.push(data?.homePath || preferences.app.defaultHomePath)
          }

          if (data?.realName) {
            notification.success({
              description: `${$t('authentication.loginSuccessDesc')}:${data?.realName}`,
              duration: 3,
              message: $t('authentication.loginSuccess'),
            })
          }
        }
      } finally {
        loginLoading.value = false
      }
    }

    async function logout(redirect: boolean = true) {
      // try {
      //   await logoutApi()
      // } catch {
      //   // 不做任何处理
      // }
      resetAllStores()
      setLoginExpired(false)

      // 回登录页带上当前路由地址
      await router.replace({
        path: LOGIN_PATH,
        query: redirect
          ? {
              redirect: encodeURIComponent(router.currentRoute.value.fullPath),
            }
          : {},
      })
    }

    return {
      userInfo,
      accessToken,
      isAccessChecked,
      originMenus,
      accessMenus,
      isLockScreen,
      loginExpired,
      lockScreenPassword,
      refreshToken,
      loginLoading,
      setAccessToken,
      setIsAccessChecked,
      setUserInfo,
      setAccessMenus,
      setLoginExpired,
      setRefreshToken,
      lockScreen,
      authLogin,
      authCodeLogin,
      logout,
      unlockScreen,
      fetchUserInfo,
      fetchAccessMenus,
    }
  },
  {
    persist: config.isMainApp
      ? {
          storage: {
            getItem: (key) => localCache.getItem(key),
            setItem: (key, value) => localCache.setItem(key, value, 0, VITE_APP_STORAGE_ENCRYPE),
          },
          pick: ['accessToken', 'isLockScreen', 'lockScreenPassword'],
        }
      : false,
  },
)
