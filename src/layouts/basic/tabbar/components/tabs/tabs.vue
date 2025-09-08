<!--
 * @Author: shen
 * @Date: 2025-06-22 11:54:26
 * @LastEditors: shen
 * @LastEditTime: 2025-06-22 14:54:02
 * @Description:
-->
<script setup lang="ts">
import type { TabDefinition } from '@/typings'

import type { TabConfig, TabsProps } from '../../types'

import { computed } from 'vue'
import TabItem from './tab-item.vue'

interface Props extends TabsProps {}

defineOptions({
  name: 'LayoutTabs',
  inheritAttrs: false,
})
const props = withDefaults(defineProps<Props>(), {
  contextMenus: () => [],
  tabs: () => [],
})

const emit = defineEmits<{
  close: [string]
  unpin: [TabDefinition]
}>()
const active = defineModel<string>('active')

const styleType = computed(() => props.styleType || 'plain')
const tabItemClass = computed(() => {
  return {
    'layout-tabs-item': true,
    [`layout-tabs-item--${styleType.value}`]: true,
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
  <div class="layout-tabs">
    <TransitionGroup name="slide-left">
      <div
        v-for="(tab, i) in tabsView"
        :key="tab.key"
        :class="{
          ...tabItemClass,
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
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="less">
.layout-tabs {
  position: relative;
  display: flex;
  align-items: center;
  width: max-content;
  height: 100%;
  padding-right: 24px;
  overflow: hidden;

  &-item {
    position: relative;
    display: flex;
    height: 100%;
    cursor: pointer;
    user-select: none;
    border-color: hsl(var(--pro-border));
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    transition-property: all;

    &.is-active {
      color: hsl(var(--pro-primary));
      background-color: hsl(var(--pro-primary) / 15%);

      &:where(.dark, .dark *) {
        color: hsl(var(--pro-accent-foreground));
        background-color: hsl(var(--pro-accent));
      }
    }

    &:not(.is-active):hover {
      background-color: hsl(var(--pro-accent));
    }

    &--plain {
      height: 100%;
      border-color: hsl(var(--pro-border));

      &:not(:first-child) {
        border-left-width: 1px;
      }

      &:last-child {
        border-right-width: 1px;
      }
    }

    &--brisk {
      height: 100%;
      border-color: hsl(var(--pro-border));

      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1.5px;
        content: '';
        background-color: hsl(var(--pro-primary));
        transform: scaleX(0);
        transform-origin: left;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
        transition-property: transform;
        animation-duration: 300ms;
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }

      &:hover&::after,
      &.is-active::after {
        transform: scaleX(1);
      }

      &:not(:first-child) {
        border-left-width: 1px;
      }

      &:last-child {
        border-right-width: 1px;
      }
    }

    &--card {
      height: calc(100% - 6px);
      margin-left: 8px;
      border-color: hsl(var(--pro-border));
      border-width: 1px;
      border-radius: calc(var(--pro-radius) - 2px);
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
      transition-property: all;
    }
  }
}
</style>
