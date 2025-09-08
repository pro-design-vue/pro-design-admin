<!--
 * @Author: shen
 * @Date: 2025-06-22 09:20:36
 * @LastEditors: shen
 * @LastEditTime: 2025-06-22 14:05:42
 * @Description:
-->
<script lang="ts" setup>
import type { IContextMenuItem } from '../../types'

import { computed, h, watchEffect } from 'vue'
import { ChevronDownIcon } from '@/icons'
import { Dropdown, Menu } from 'ant-design-vue'
import { ProIcon } from '@/components/common'

const props = defineProps<{ menus?: IContextMenuItem[] }>()

const handleMap = new Map<string, IContextMenuItem['handler']>()
const items = computed(() => {
  return (
    props.menus?.map((item) => {
      return {
        disabled: item.disabled,
        icon: h(ProIcon, { icon: item.icon, style: { fontSize: '16px' } }),
        label: item.text,
        key: item.key,
      }
    }) ?? []
  )
})

watchEffect(() => {
  props.menus?.forEach((item) => {
    handleMap.set(item.key, item.handler)
  })
})

const handleClick = ({ key }) => {
  const handler = handleMap.get(key)
  handler?.()
}
</script>

<template>
  <Dropdown :trigger="['click']" placement="bottom" overlayClassName="layout-tabbar-tool-more">
    <div class="layout-tabbar-tool-more-btn">
      <ChevronDownIcon />
    </div>
    <template #overlay>
      <Menu :items="items" @click="handleClick" />
    </template>
  </Dropdown>
</template>

<style lang="less" scoped>
.layout-tabbar-tool-more {
  &-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 8px;
    font-size: 16px;
    font-weight: 600;
    line-height: 28px;
    color: hsl(var(--pro-muted-foreground));
    cursor: pointer;
    border-color: hsl(var(--pro-border));
    border-left-width: 1px;

    &:hover {
      color: hsl(var(--pro-foreground));
      background-color: hsl(var(--pro-muted));
    }
  }
}
</style>
