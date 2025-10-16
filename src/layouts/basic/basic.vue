<!--
 * @Author: shen
 * @Date: 2025-05-27 15:02:08
 * @LastEditors: shen
 * @LastEditTime: 2025-10-16 10:49:05
 * @Description:
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRefresh, useWatermark } from '@/hooks'
import { App } from 'ant-design-vue'
import { $t, i18n } from '@/shared/locales'
import { useAuthStore } from '@/stores'
import { ProLayout } from 'pro-design-vue'
import { BookOpenTextIcon, MdiGithub } from '@/icons'
import { LayoutLogo } from './logo'
import { LayoutContent, LayoutContentSpinner } from './content'
import { LayoutMenu, LayoutMixedMenu, useExtraMenu, useMixedMenu } from './menu'
import {
  Breadcrumb,
  Notification,
  UserDropdown,
  LockScreen,
  Preferences,
  Copyright,
  type NotificationItem,
} from '../widgets'
import { LayoutHeader } from './header'
import { LayoutTabbar } from './tabbar'
import { LayoutFooter } from './footer'
import { BackTop } from './back-top'
import { DOC_URL, ADMIN_GITHUB_URL, COMPONENT_GITHUB_URL } from '@/shared/constants'
import { preferences, updatePreferences, usePreferences } from '@/shared/preferences'
import DefaultLogo from '@/assets/logo_small.png'
import DefaultAvatar from '@/assets/avatar-v1.webp'
defineOptions({ name: 'BasicLayout' })

const {
  isDark,
  isHeaderNav,
  isMixedNav,
  isMobile,
  isSideMixedNav,
  isHeaderMixedNav,
  isHeaderSidebarNav,
  layout,
  preferencesButtonPosition,
  sidebarCollapsed,
  theme,
} = usePreferences()
const authStore = useAuthStore()
const { destroyWatermark, updateWatermark } = useWatermark()
const { refresh } = useRefresh()
const { message } = App.useApp()
const sidebarTheme = computed(() => {
  const dark = isDark.value || preferences.theme.semiDarkSidebar
  return dark ? 'dark' : 'light'
})

const headerTheme = computed(() => {
  const dark = isDark.value || preferences.theme.semiDarkHeader
  return dark ? 'dark' : 'light'
})

const logoStyle = computed(() => {
  let styles = {}
  const { collapsedShowTitle } = preferences.sidebar

  if (collapsedShowTitle && sidebarCollapsed.value && !isMixedNav.value) {
    styles = { margin: '0 auto' }
  }

  if (isSideMixedNav.value) {
    styles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  }
  return styles
})

const isMenuRounded = computed(() => {
  return preferences.navigation.styleType === 'rounded'
})

const logoCollapsed = computed(() => {
  if (isMobile.value && sidebarCollapsed.value) {
    return true
  }
  if (isHeaderNav.value || isMixedNav.value || isHeaderSidebarNav.value) {
    return false
  }
  return sidebarCollapsed.value || isSideMixedNav.value || isHeaderMixedNav.value
})

const showHeaderNav = computed(() => {
  return !isMobile.value && (isHeaderNav.value || isMixedNav.value || isHeaderMixedNav.value)
})

const {
  handleMenuSelect,
  headerActive,
  headerMenus,
  needSplit,
  sidebarActive,
  sidebarMenus,
  mixHeaderMenus,
  sidebarVisible,
} = useMixedMenu()

// 侧边多列菜单
const {
  extraActiveMenu,
  extraMenus,
  handleDefaultSelect,
  handleMenuMouseEnter,
  handleMixedMenuSelect,
  handleSideMouseLeave,
  sidebarExtraVisible,
} = useExtraMenu(mixHeaderMenus)

const toggleSidebar = () => {
  updatePreferences({
    sidebar: {
      hidden: !preferences.sidebar.hidden,
    },
  })
}

const clickLogo = () => {
  console.log('clickLogo')
}

watch(
  () => preferences.app.layout,
  async (val) => {
    if (val === 'sidebar-mixed-nav' && preferences.sidebar.hidden) {
      updatePreferences({
        sidebar: {
          hidden: false,
        },
      })
    }
  },
)

// 语言更新后，刷新页面
// i18n.global.locale会在preference.app.locale变更之后才会更新，因此watchpreference.app.locale是不合适的，刷新页面时可能语言配置尚未完全加载完成
watch(i18n.global.locale, refresh, { flush: 'post' })

watch(
  () => preferences.app.watermark,
  async (enable) => {
    if (enable) {
      await updateWatermark({
        content: `${authStore.userInfo?.username} - ${authStore.userInfo?.realName}`,
      })
    } else {
      destroyWatermark()
    }
  },
  {
    immediate: true,
  },
)

//用户弹出相关

const avatar = computed(() => {
  return authStore.userInfo?.avatar || preferences.app.defaultAvatar || DefaultAvatar
})

const menus = computed(() => [
  {
    key: 'document',
    icon: BookOpenTextIcon,
    label: $t('ui.widgets.document'),
  },
  {
    key: 'admin',
    icon: MdiGithub,
    label: 'Pro Design Admin',
  },
  {
    key: 'vue',
    icon: MdiGithub,
    label: 'Pro Design Vue',
  },
])

const handleLogout = async () => {
  authStore.logout(false)
}

const handleMenuClcik = (key: string | number) => {
  switch (key) {
    case 'document':
      window.open(DOC_URL)
      break
    case 'admin':
      window.open(ADMIN_GITHUB_URL)
      break
    case 'vue':
      window.open(COMPONENT_GITHUB_URL)
      break
  }
}

const handleLockScreen = (password: string) => {
  authStore.lockScreen(password)
}

const handleUnLockScreen = (password: string) => {
  if (authStore.lockScreenPassword === password) {
    authStore.unlockScreen()
  } else {
    message.error($t('authentication.passwordErrorTip'))
  }
}

//消息通知相关，建议抽离单独组件
const notifications = ref<NotificationItem[]>([
  {
    avatar: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    date: '3小时前',
    isRead: true,
    message: '描述信息描述信息描述信息',
    title: '收到了 14 份新周报',
  },
  {
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
    date: '刚刚',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '朱偏右 回复了你',
  },
  {
    avatar: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    date: '2024-01-01',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '曲丽丽 评论了你',
  },
  {
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
    date: '1天前',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '代办提醒',
  },
])

const showDot = computed(() => notifications.value.some((item) => !item.isRead))

const handleNoticeClear = () => {
  notifications.value = []
}

const handleMakeAll = () => {
  notifications.value.forEach((item) => (item.isRead = true))
}
</script>

<template>
  <ProLayout
    v-model:sidebar-extra-visible="sidebarExtraVisible"
    :content-compact="preferences.app.contentCompact"
    :footer-enable="preferences.footer.enable"
    :footer-fixed="preferences.footer.fixed"
    :header-hidden="preferences.header.hidden"
    :header-mode="preferences.header.mode"
    :header-theme="headerTheme"
    :header-toggle-sidebar-button="preferences.widget.sidebarToggle"
    :header-visible="preferences.header.enable"
    :is-mobile="preferences.app.isMobile"
    :layout="layout"
    :sidebar-collapse="preferences.sidebar.collapsed"
    :sidebar-collapse-show-title="preferences.sidebar.collapsedShowTitle"
    :sidebar-enable="sidebarVisible"
    :sidebar-collapsed-button="preferences.sidebar.collapsedButton"
    :sidebar-fixed-button="preferences.sidebar.fixedButton"
    :sidebar-expand-on-hover="preferences.sidebar.expandOnHover"
    :sidebar-extra-collapse="preferences.sidebar.extraCollapse"
    :sidebar-hidden="preferences.sidebar.hidden"
    :sidebar-theme="sidebarTheme"
    :sidebar-width="preferences.sidebar.width"
    :tabbar-enable="preferences.tabbar.enable"
    :tabbar-height="preferences.tabbar.height"
    @side-mouse-leave="handleSideMouseLeave"
    @toggle-sidebar="toggleSidebar"
    @update:sidebar-collapse="
      (value: boolean) => updatePreferences({ sidebar: { collapsed: value } })
    "
    @update:sidebar-enable="(value: boolean) => updatePreferences({ sidebar: { enable: value } })"
    @update:sidebar-expand-on-hover="
      (value: boolean) => updatePreferences({ sidebar: { expandOnHover: value } })
    "
    @update:sidebar-extra-collapse="
      (value: boolean) => updatePreferences({ sidebar: { extraCollapse: value } })
    "
  >
    <!-- logo -->
    <template #logo>
      <LayoutLogo
        v-if="preferences.logo.enable"
        :style="logoStyle"
        :collapsed="logoCollapsed"
        :src="preferences.logo.source || DefaultLogo"
        :text="preferences.app.name"
        :theme="showHeaderNav ? headerTheme : theme"
        @click="clickLogo"
      />
    </template>
    <!-- 头部区域 -->
    <template #header>
      <LayoutHeader :theme="theme" @clear-preferences-and-logout="handleLogout">
        <template v-if="!showHeaderNav && preferences.breadcrumb.enable" #breadcrumb>
          <Breadcrumb
            :hide-when-only-one="preferences.breadcrumb.hideOnlyOne"
            :show-home="preferences.breadcrumb.showHome"
            :show-icon="preferences.breadcrumb.showIcon"
          />
        </template>
        <template v-if="showHeaderNav" #menu>
          <LayoutMenu
            :key="needSplit.toString()"
            :default-active="headerActive"
            :menus="headerMenus"
            :theme="headerTheme"
            mode="horizontal"
            style="width: 100%"
            @select="handleMenuSelect"
          />
        </template>
        <template #user-dropdown>
          <UserDropdown
            :avatar
            :menus
            :text="authStore.userInfo?.realName"
            description="shen.it@foxmail.com"
            tag-text="Pro"
            @lock="handleLockScreen"
            @logout="handleLogout"
            @menu-click="handleMenuClcik"
          />
        </template>
        <template #notification>
          <Notification
            :dot="showDot"
            :notifications="notifications"
            @clear="handleNoticeClear"
            @make-all="handleMakeAll"
          />
        </template>
      </LayoutHeader>
    </template>

    <!-- 侧边菜单区域 -->
    <template #menu>
      <LayoutMenu
        :accordion="preferences.navigation.accordion"
        :collapsed="preferences.sidebar.collapsed"
        :default-active="sidebarActive"
        :menus="sidebarMenus"
        :theme="sidebarTheme"
        :rounded="isMenuRounded"
        mode="inline"
        @select="handleMenuSelect"
      />
    </template>
    <template #mixed-menu>
      <LayoutMixedMenu
        :active-path="extraActiveMenu"
        :menus="mixHeaderMenus"
        :rounded="isMenuRounded"
        :theme="sidebarTheme"
        @default-select="handleDefaultSelect"
        @enter="handleMenuMouseEnter"
        @select="handleMixedMenuSelect"
      />
    </template>
    <!-- 侧边额外区域 -->
    <template #side-extra>
      <LayoutMenu
        :default-active="sidebarActive"
        :accordion="preferences.navigation.accordion"
        :collapsed="preferences.sidebar.extraCollapse"
        :menus="extraMenus"
        :rounded="isMenuRounded"
        :theme="sidebarTheme"
        mode="inline"
        @select="handleMenuSelect"
      />
    </template>

    <template #side-extra-title>
      <LayoutLogo v-if="preferences.logo.enable" :text="preferences.app.name" :theme="theme" />
    </template>

    <template #tabbar>
      <LayoutTabbar
        v-if="preferences.tabbar.enable"
        :show-icon="preferences.tabbar.showIcon"
        :theme="theme"
      />
    </template>

    <template #content>
      <LayoutContent />
    </template>

    <template v-if="preferences.transition.loading" #content-overlay>
      <LayoutContentSpinner />
    </template>

    <!-- 页脚 -->
    <template v-if="preferences.footer.enable" #footer>
      <LayoutFooter>
        <Copyright v-if="preferences.copyright.enable" v-bind="preferences.copyright" />
      </LayoutFooter>
    </template>

    <template #extra>
      <Transition v-if="preferences.widget.lockScreen" name="slide-up">
        <LockScreen
          v-if="authStore.isLockScreen"
          :avatar
          @to-login="handleLogout"
          @un-lock="handleUnLockScreen"
        />
      </Transition>

      <template v-if="preferencesButtonPosition.fixed">
        <Preferences
          :copyrightSettingShow="preferences.copyright.settingShow"
          style="position: fixed; right: 0; bottom: 80px; z-index: 100"
          @clear-preferences-and-logout="handleLogout"
        />
      </template>
      <BackTop />
    </template>
  </ProLayout>
</template>
