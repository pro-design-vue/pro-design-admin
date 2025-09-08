<!--
 * @Author: shen
 * @Date: 2025-06-22 11:54:26
 * @LastEditors: shen
 * @LastEditTime: 2025-06-22 16:07:41
 * @Description:
-->
<script setup lang="ts">
import type { TabDefinition } from '@/typings'

import type { IContextMenuItem, TabConfig } from '../../types'

import { computed, h, watchEffect } from 'vue'
import { Dropdown, Menu } from 'ant-design-vue'
import { PinIcon, XIcon } from '@/icons'
import { ProIcon } from '@/components/common'

interface Props {
  tabsView: TabConfig[]
  tab: TabConfig
  showIcon?: boolean
  contextMenus?: (data: any) => IContextMenuItem[]
}

defineOptions({
  name: 'LayoutTabItem',
  inheritAttrs: false,
})
const props = withDefaults(defineProps<Props>(), {
  contextMenus: () => [],
  tabsView: () => [],
  tab: () => ({}) as TabConfig,
})

const emit = defineEmits<{
  close: [string]
  unpin: [TabDefinition]
}>()

const handleMap = new Map<string, IContextMenuItem['handler']>()
const menus = computed(() => props.contextMenus(props.tab) ?? [])
const items = computed(() => {
  return (
    menus.value.map((item) => {
      return {
        disabled: item.disabled,
        icon: h(ProIcon, { icon: item.icon, style: { fontSize: '16px' } }),
        label: item.text,
        key: item.key,
      }
    }) ?? []
  )
})

const handleClick = ({ key }) => {
  const handler = handleMap.get(key)
  handler?.()
}

watchEffect(() => {
  menus.value.forEach((item) => {
    handleMap.set(item.key, item.handler)
  })
})
</script>

<template>
  <Dropdown :trigger="['contextmenu']">
    <div class="layout-tabs-item-wrap">
      <slot />
      <!-- extra -->
      <div class="layout-tabs-item-extra">
        <!-- close-icon -->
        <XIcon
          v-show="!tab.affixTab && tabsView.length > 1 && tab.closable"
          style="font-size: 12px"
          @click.stop="() => emit('close', tab.key)"
        />
        <PinIcon
          v-show="tab.affixTab && tabsView.length > 1 && tab.closable"
          style="margin-top: 1px; font-size: 14px"
          @click.stop="() => emit('unpin', tab)"
        />
      </div>

      <!-- tab-item-main -->
      <div class="layout-tabs-item-main">
        <ProIcon v-if="showIcon" :icon="tab.icon" class="layout-tabs-item-main-icon" fallback />
        <span class="layout-tabs-item-main-text">
          {{ tab.title }}
        </span>
      </div>
    </div>
    <template #overlay>
      <Menu :items="items" @click="handleClick" />
    </template>
  </Dropdown>
</template>

<style scoped lang="less">
.layout-tabs-item {
  &-wrap {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    padding: 0 4px;
  }

  &-extra {
    position: absolute;
    top: 50%;
    right: var(--gap);
    z-index: 3;
    width: 16px;
    overflow: hidden;
    // height: 16px;
    font-size: 0;
    transform: translateY(-50%);
  }

  &-main {
    z-index: 2;
    display: flex;
    align-items: center;
    height: 100%;
    padding-right: 16px;
    padding-left: 8px;
    margin: 0 calc(var(--gap) * 2);
    overflow: hidden;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    transition-duration: 150ms;
    animation-duration: 150ms;

    &-icon {
      align-items: center;
      margin-right: 8px;
      overflow: hidden;
      font-size: 16px;
    }

    &-text {
      flex: 1 1 0%;
      overflow: hidden;
      font-size: 14px;
      line-height: 20px;
      white-space: nowrap;
    }
  }
}
</style>
