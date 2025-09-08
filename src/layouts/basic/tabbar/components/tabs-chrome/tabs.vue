<!--
 * @Author: shen
 * @Date: 2025-06-22 11:54:26
 * @LastEditors: shen
 * @LastEditTime: 2025-06-22 16:18:36
 * @Description:
-->
<script setup lang="ts">
import type { TabDefinition } from '@/typings'

import type { TabConfig, TabsProps } from '../../types'

import { computed } from 'vue'
import TabItem from './tab-item.vue'

interface Props extends TabsProps {}

defineOptions({
  name: 'LayoutTabsChrome',
  inheritAttrs: false,
})
const props = withDefaults(defineProps<Props>(), {
  contextMenus: () => [],
  tabs: () => [],
  gap: 7,
})

const emit = defineEmits<{
  close: [string]
  unpin: [TabDefinition]
}>()
const active = defineModel<string>('active')
const style = computed(() => {
  const { gap } = props
  return {
    '--gap': `${gap}px`,
  }
})

const tabsView = computed(() => {
  return props.tabs.map((tab) => {
    const { fullPath, meta, name, path } = tab || {}
    const { affixTab, icon, newTabTitle, tabClosable, title } = meta || {}
    return {
      affixTab: !!affixTab,
      closable: Reflect.has(meta, 'tabClosable') ? !!tabClosable : true,
      fullPath,
      icon: icon as string,
      key: fullPath || path,
      meta,
      name,
      path,
      title: (newTabTitle || title || name) as string,
    } as TabConfig
  })
})

function onMouseDown(e: MouseEvent, tab: TabConfig) {
  if (
    e.button === 1 &&
    tab.closable &&
    !tab.affixTab &&
    tabsView.value.length > 1 &&
    props.middleClickToClose
  ) {
    e.preventDefault()
    e.stopPropagation()
    emit('close', tab.key)
  }
}
</script>

<template>
  <div class="layout-tabs" :style="style">
    <TransitionGroup name="slide-left">
      <div
        v-for="(tab, i) in tabsView"
        :key="tab.key"
        class="layout-tabs-item"
        :class="{
          'is-active': tab.key === active,
          draggable: !tab.affixTab,
          'affix-tab': tab.affixTab,
        }"
        :data-index="i"
        data-tab-item="true"
        @click="active = tab.key"
        @mousedown="onMouseDown($event, tab)"
      >
        <TabItem
          :context-menus="contextMenus"
          :tab="tab"
          :tabs-view="tabsView"
          :show-icon="showIcon"
          @close="emit('close', tab.key)"
          @unpin="emit('unpin', tab)"
        >
          <!-- divider -->
          <div v-if="i !== 0 && tab.key !== active" class="layout-tabs-item__divider"></div>
          <!-- background -->
          <div class="layout-tabs-item__background">
            <div class="layout-tabs-item__background-content"></div>
            <svg class="layout-tabs-item__background-before" height="7" width="7">
              <path d="M 0 7 A 7 7 0 0 0 7 0 L 7 7 Z" />
            </svg>
            <svg class="layout-tabs-item__background-after" height="7" width="7">
              <path d="M 0 0 A 7 7 0 0 0 7 7 L 0 7 Z" />
            </svg>
          </div>
        </TabItem>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="less">
.layout-tabs {
  position: relative;
  display: flex;
  width: max-content;
  height: 100%;
  padding-right: 24px;
  overflow-y: hidden;

  &-item {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: -12px;
    user-select: none;

    &__divider {
      position: absolute;
      top: 50%;
      left: var(--gap);
      z-index: 0;
      width: 1px;
      height: 16px;
      background-color: hsl(var(--pro-border));
      transform: translateY(-50%);
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
      transition-property: all;
    }

    &__background {
      position: absolute;
      z-index: 0;
      width: 100%;
      height: 100%;
      padding: 0 calc(var(--gap) - 1px);
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
      transition-property: opacity;
      animation-duration: 150ms;

      &-content {
        height: 100%;
        border-top-left-radius: var(--gap);
        border-top-right-radius: var(--gap);
        transition-duration: 150ms;
        animation-duration: 150ms;
      }

      &-before {
        position: absolute;
        bottom: 0;
        left: -1px;
        fill: transparent;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        transition-property: all;
        animation-duration: 150ms;
      }

      &-after {
        position: absolute;
        right: -1px;
        bottom: 0;
        fill: transparent;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        transition-property: all;
        animation-duration: 150ms;
      }
    }

    &:not(.dragging) {
      cursor: pointer;

      &:hover:not(.is-active) {
        & + .layout-tabs-item {
          .layout-tabs-item__divider {
            opacity: 0;
          }
        }

        .layout-tabs-item__divider {
          opacity: 0;
        }

        .layout-tabs-item__background {
          padding-bottom: 2px;

          &-content {
            margin-right: 2px;
            margin-left: 2px;
            background-color: hsl(var(--pro-accent));
            border-radius: calc(var(--pro-radius) - 2px);
          }
        }
      }
    }

    &.is-active {
      z-index: 2;
      color: hsl(var(--pro-primary));

      &:where(.dark, .dark *) {
        color: hsl(var(--pro-accent-foreground));
      }

      & + .layout-tabs-item {
        .layout-tabs-item__divider {
          opacity: 0 !important;
        }
      }

      .layout-tabs-item__background {
        &-content {
          background-color: hsl(var(--pro-primary) / 15%);

          &:where(.dark, .dark *) {
            background-color: hsl(var(--pro-accent));
          }
        }

        &-before,
        &-after {
          fill: hsl(var(--pro-primary) / 15%);

          &:where(.dark, .dark *) {
            fill: hsl(var(--pro-accent));
          }
        }
      }
    }
  }
}
</style>
