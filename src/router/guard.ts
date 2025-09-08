/*
 * @Author: shen
 * @Date: 2025-05-27 10:09:12
 * @LastEditors: shen
 * @LastEditTime: 2025-08-14 15:24:12
 * @Description:
 */
import type { Router } from 'vue-router'

import { startProgress, stopProgress } from '@/shared/utils'
import { accessRoutes, coreRouteNames } from './routes'
import { LOGIN_PATH } from '@/shared/constants'
import { generateAccess } from './access'
import { resetAllStores, useAuthStore } from '@/stores'
import { preferences } from '@/shared/preferences'
import config from '@/config'
/**
 * 通用守卫配置
 * @param router
 */
const setupCommonGuard = (router: Router) => {
  // 记录已经加载的页面
  const loadedPaths = new Set<string>()

  router.beforeEach((to) => {
    to.meta.loaded = loadedPaths.has(to.path)

    // 页面加载进度条
    if (!to.meta.loaded && preferences.transition.progress) {
      startProgress()
    }
    return true
  })

  router.afterEach((to) => {
    // 记录页面是否加载,如果已经加载，后续的页面切换动画等效果不在重复执行
    loadedPaths.add(to.path)

    // 关闭页面加载进度条
    if (preferences.transition.progress) {
      stopProgress()
    }
  })
}

/**
 * 权限访问守卫配置
 * @param router
 */
const setupAccessGuard = (router: Router) => {
  router.beforeEach(async (to, from) => {
    if (config.powerByMicro) {
      return true
    }
    // const appStore = useAppStore()
    const authStore = useAuthStore()
    // 基本路由，这些路由不需要进入权限拦截
    if (coreRouteNames.includes(to.name as string)) {
      if (to.path === LOGIN_PATH && authStore.accessToken) {
        return decodeURIComponent(
          (to.query?.redirect as string) ||
            authStore.userInfo?.homePath ||
            preferences.app.defaultHomePath,
        )
      }
      return true
    }

    // accessToken 检查
    if (!authStore.accessToken) {
      // 明确声明忽略权限访问权限，则可以访问
      if (to.meta.ignoreAccess) {
        return true
      }

      // 没有访问权限，跳转登录页面
      if (to.fullPath !== LOGIN_PATH) {
        return {
          path: LOGIN_PATH,
          // 如不需要，直接删除 query
          query:
            to.fullPath === preferences.app.defaultHomePath
              ? {}
              : { redirect: encodeURIComponent(to.fullPath) },
          // 携带当前跳转的页面，登录后重新跳转该页面
          replace: true,
        }
      }
    }

    // 是否已经生成过动态路由
    if (authStore.isAccessChecked) {
      return true
    }
    const userInfo = authStore.userInfo || (await authStore.fetchUserInfo())
    if (!userInfo) {
      resetAllStores()
      return {
        path: LOGIN_PATH,
        // 如不需要，直接删除 query
        query:
          to.fullPath === preferences.app.defaultHomePath
            ? {}
            : { redirect: encodeURIComponent(to.fullPath) },
        // 携带当前跳转的页面，登录后重新跳转该页面
        replace: true,
      }
    }

    // originMenus 不能是树形结构
    const originMenus = authStore.originMenus?.length
      ? authStore.originMenus
      : await authStore.fetchAccessMenus()

    // 生成有权限路由
    await generateAccess({
      router,
      menus: originMenus,
      // 则会在菜单中显示，但是访问会被重定向到403
      routes: accessRoutes,
    })
    authStore.setAccessMenus(originMenus)
    authStore.setIsAccessChecked(true)

    const redirectPath = (from.query.redirect ??
      (to.path === preferences.app.defaultHomePath
        ? userInfo.homePath || preferences.app.defaultHomePath
        : to.fullPath)) as string
    return {
      ...router.resolve(decodeURIComponent(redirectPath)),
      replace: true,
    }
  })
}

/**
 * 项目守卫配置
 * @param router
 */
function createRouterGuard(router: Router) {
  /** 通用 */
  setupCommonGuard(router)
  /** 权限访问 */
  setupAccessGuard(router)
}

export { createRouterGuard }
