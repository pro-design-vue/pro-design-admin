<!--
 * @Author: shen
 * @Date: 2025-06-21 21:40:56
 * @LastEditors: shen
 * @LastEditTime: 2025-08-01 15:38:43
 * @Description:
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useContentMaximize, useTabs } from '@/hooks'
import { preferences } from '@/shared/preferences'
import { useTabbarStore } from '@/stores'
import { ChevronLeftIcon, ChevronRightIcon } from '@/icons'
import { useTabsViewScroll } from './use-tabs-view-scroll'
import { useTabbar } from './use-tabbar'
import { useTabsDrag } from './use-tabs-drag'
import { TabbarToolMore, TabbarToolScreen, Tabs, TabsChrome } from './components'

interface Props {
  /**
   * @zh_CN 是否显示图标
   */
  showIcon?: boolean
  theme?: string
}

defineOptions({
  name: 'LayoutTabbar',
})

defineProps<Props>()

const route = useRoute()
const tabbarStore = useTabbarStore()
const { contentIsMaximize, toggleMaximize } = useContentMaximize()
const { unpinTab } = useTabs()

const { createContextMenus, currentActive, currentTabs, handleClick, handleClose } = useTabbar()

const {
  handleScrollAt,
  handleWheel,
  scrollRef,
  scrollWrapRef,
  scrollDirection,
  scrollIsAtLeft,
  scrollIsAtRight,
  showScrollButton,
} = useTabsViewScroll({
  tabs: currentTabs,
  active: currentActive,
  styleType: computed(() => preferences.tabbar.styleType),
})

const menus = computed(() => {
  const tab = tabbarStore.getTabByPath(currentActive.value)
  return createContextMenus(tab)
})

function onWheel(e: WheelEvent) {
  if (preferences.tabbar.wheelable) {
    handleWheel(e)
    e.stopPropagation()
    e.preventDefault()
  }
}
useTabsDrag(preferences.tabbar.draggable, preferences.tabbar.styleType, tabbarStore.sortTabs)

// 刷新后如果不保持tab状态，关闭其他tab
if (!preferences.tabbar.persist) {
  tabbarStore.closeOtherTabs(route)
}
</script>

<template>
  <div class="layout-tabbar" :class="theme">
    <span
      v-show="showScrollButton"
      :class="['layout-tabbar-scroll-btn left', scrollIsAtLeft ? 'disabled' : '']"
      @click="scrollDirection('left')"
    >
      <ChevronLeftIcon />
    </span>
    <div
      class="layout-tabbar-wrap"
      :style="{ paddingTop: preferences.tabbar.styleType === 'chrome' ? '3px' : '0px' }"
    >
      <div class="layout-tabbar-scroll" ref="scrollRef">
        <div
          class="layout-tabbar-scroll-wrap"
          ref="scrollWrapRef"
          @scroll="handleScrollAt"
          @wheel="onWheel"
        >
          <TabsChrome
            v-if="preferences.tabbar.styleType === 'chrome'"
            :active="currentActive"
            :class="theme"
            :context-menus="createContextMenus"
            :draggable="preferences.tabbar.draggable"
            :show-icon="showIcon"
            :tabs="currentTabs"
            :middle-click-to-close="preferences.tabbar.middleClickToClose"
            @close="handleClose"
            @sort-tabs="tabbarStore.sortTabs"
            @unpin="unpinTab"
            @update:active="handleClick"
          />
          <Tabs
            v-else
            :active="currentActive"
            :class="theme"
            :context-menus="createContextMenus"
            :draggable="preferences.tabbar.draggable"
            :show-icon="showIcon"
            :style-type="preferences.tabbar.styleType"
            :tabs="currentTabs"
            :wheelable="preferences.tabbar.wheelable"
            :middle-click-to-close="preferences.tabbar.middleClickToClose"
            @close="handleClose"
            @sort-tabs="tabbarStore.sortTabs"
            @unpin="unpinTab"
            @update:active="handleClick"
          />
        </div>
      </div>
    </div>
    <span
      v-show="showScrollButton"
      :class="['layout-tabbar-scroll-btn right', scrollIsAtRight ? 'disabled' : '']"
      @click="scrollDirection('right')"
    >
      <ChevronRightIcon />
    </span>
  </div>
  <div class="layout-tabbar-action">
    <TabbarToolMore v-if="preferences.tabbar.showMore" :menus />
    <TabbarToolScreen
      v-if="preferences.tabbar.showMaximize"
      :screen="contentIsMaximize"
      @change="toggleMaximize"
      @update:screen="toggleMaximize"
    />
  </div>
</template>

<style scoped lang="less">
.layout-tabbar {
  display: flex;
  flex: 1 1 0%;
  height: 100%;
  overflow: hidden;

  &-scroll-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    font-size: 16px;
    color: hsl(var(--pro-muted-foreground));
    cursor: pointer;

    &:hover {
      background-color: hsl(var(--pro-muted));
    }

    &.right {
      border-left-width: 1px;
    }

    &.left {
      border-right-width: 1px;
    }

    &.disabled {
      pointer-events: none;
      cursor: not-allowed;
      opacity: 0.3;

      &:hover {
        background-color: transparent;
      }
    }
  }

  &-wrap {
    flex: 1 1 0%;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &-scroll {
    position: relative;
    height: 100%;
    overflow: hidden;

    &-wrap {
      width: 100%;
      height: 100%;
      overflow: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
    }
  }

  &-action {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>
