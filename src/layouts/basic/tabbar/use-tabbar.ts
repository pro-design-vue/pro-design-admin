import type { RouteLocationNormalizedGeneric } from 'vue-router'

import type { TabDefinition } from '@/typings'

import type { IContextMenuItem } from './types'

import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useContentMaximize, useTabs } from '@/hooks'
import {
  ArrowLeftToLineIcon,
  ArrowRightLeftIcon,
  ArrowRightToLineIcon,
  ExternalLinkIcon,
  FoldHorizontalIcon,
  FullscreenIcon,
  Minimize2Icon,
  PinIcon,
  PinOffIcon,
  RotateCwIcon,
  XIcon,
} from '@/icons'
import { $t } from '@/shared/locales'
import { useAuthStore, useTabbarStore } from '@/stores'
import { filterTree } from '@/shared/utils'

export function useTabbar() {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  const tabbarStore = useTabbarStore()
  const { contentIsMaximize, toggleMaximize } = useContentMaximize()
  const {
    closeAllTabs,
    closeCurrentTab,
    closeLeftTabs,
    closeOtherTabs,
    closeRightTabs,
    closeTabByKey,
    getTabDisableState,
    openTabInNewWindow,
    refreshTab,
    toggleTabPin,
    resetAllTabTitle,
  } = useTabs()

  const currentActive = computed(() => {
    return route.fullPath
  })

  const currentTabs = ref<RouteLocationNormalizedGeneric[]>()
  watch([() => tabbarStore.getTabs, () => tabbarStore.updateTime], ([tabs]) => {
    currentTabs.value = [...tabs]
  })

  /**
   * 初始化固定标签页
   */
  const initAffixTabs = () => {
    const affixTabs = filterTree(router.getRoutes(), (route) => {
      return !!route.meta?.affixTab
    })
    tabbarStore.setAffixTabs(affixTabs)
  }

  // 点击tab,跳转路由
  const handleClick = (key?: string) => {
    if (key) {
      router.push(key)
    }
  }

  // 关闭tab
  const handleClose = async (key: string) => {
    await closeTabByKey(key)
  }

  watch(
    () => authStore.accessMenus,
    () => {
      initAffixTabs()
    },
    { immediate: true },
  )

  watch(
    () => route.path,
    () => {
      const meta = route.matched?.[route.matched.length - 1]?.meta
      tabbarStore.addTab({
        ...route,
        meta: meta || route.meta,
      })
    },
    { immediate: true },
  )

  const createContextMenus = (tab: TabDefinition) => {
    const {
      disabledCloseAll,
      disabledCloseCurrent,
      disabledCloseLeft,
      disabledCloseOther,
      disabledCloseRight,
      disabledRefresh,
    } = getTabDisableState(tab)

    const affixTab = tab?.meta?.affixTab ?? false

    const menus: IContextMenuItem[] = [
      {
        disabled: disabledCloseCurrent,
        handler: async () => {
          await closeCurrentTab(tab)
        },
        icon: XIcon,
        key: 'close',
        text: $t('preferences.tabbar.contextMenu.close'),
      },
      {
        handler: async () => {
          await toggleTabPin(tab)
        },
        icon: affixTab ? PinOffIcon : PinIcon,
        key: 'affix',
        text: affixTab
          ? $t('preferences.tabbar.contextMenu.unpin')
          : $t('preferences.tabbar.contextMenu.pin'),
      },
      {
        handler: async () => {
          if (!contentIsMaximize.value) {
            await router.push(tab.fullPath)
          }
          toggleMaximize()
        },
        icon: contentIsMaximize.value ? Minimize2Icon : FullscreenIcon,
        key: contentIsMaximize.value ? 'restore-maximize' : 'maximize',
        text: contentIsMaximize.value
          ? $t('preferences.tabbar.contextMenu.restoreMaximize')
          : $t('preferences.tabbar.contextMenu.maximize'),
      },
      {
        disabled: disabledRefresh,
        handler: refreshTab,
        icon: RotateCwIcon,
        key: 'reload',
        text: $t('preferences.tabbar.contextMenu.reload'),
      },
      {
        handler: async () => {
          await openTabInNewWindow(tab)
        },
        icon: ExternalLinkIcon,
        key: 'open-in-new-window',
        separator: true,
        text: $t('preferences.tabbar.contextMenu.openInNewWindow'),
      },

      {
        disabled: disabledCloseLeft,
        handler: async () => {
          await closeLeftTabs(tab)
        },
        icon: ArrowLeftToLineIcon,
        key: 'close-left',
        text: $t('preferences.tabbar.contextMenu.closeLeft'),
      },
      {
        disabled: disabledCloseRight,
        handler: async () => {
          await closeRightTabs(tab)
        },
        icon: ArrowRightToLineIcon,
        key: 'close-right',
        separator: true,
        text: $t('preferences.tabbar.contextMenu.closeRight'),
      },
      {
        disabled: disabledCloseOther,
        handler: async () => {
          await closeOtherTabs(tab)
        },
        icon: FoldHorizontalIcon,
        key: 'close-other',
        text: $t('preferences.tabbar.contextMenu.closeOther'),
      },
      {
        disabled: disabledCloseAll,
        handler: closeAllTabs,
        icon: ArrowRightLeftIcon,
        key: 'close-all',
        text: $t('preferences.tabbar.contextMenu.closeAll'),
      },
    ]
    return menus.filter((item) => tabbarStore.getMenuList.includes(item.key))
  }

  onMounted(() => {
    resetAllTabTitle()
  })

  return {
    createContextMenus,
    currentActive,
    currentTabs,
    handleClick,
    handleClose,
  }
}
