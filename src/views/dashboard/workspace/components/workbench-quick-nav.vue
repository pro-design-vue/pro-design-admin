<!--
 * @Author: shen
 * @Date: 2025-07-03 13:34:03
 * @LastEditors: shen
 * @LastEditTime: 2025-07-04 09:55:59
 * @Description:
-->
<script setup lang="ts">
import type { Component } from 'vue'

import { Card } from 'ant-design-vue'
import { ProIcon } from '@/components/common'

export interface WorkbenchQuickNavItem {
  color?: string
  icon: Component | string
  title: string
  url?: string
}

interface Props {
  items?: WorkbenchQuickNavItem[]
  title: string
}

defineOptions({
  name: 'WorkbenchQuickNav',
})

withDefaults(defineProps<Props>(), {
  items: () => [],
})

defineEmits(['click'])
</script>

<template>
  <Card :title="title">
    <template v-for="item in items" :key="item.title">
      <Card.Grid @click="$emit('click', item)" class="workbench-quick-nav">
        <div class="workbench-quick-nav-wrap">
          <ProIcon :color="item.color" :icon="item.icon" class="workbench-quick-nav-icon" />
          <span class="workbench-quick-nav-title">{{ item.title }}</span>
        </div>
      </Card.Grid>
    </template>
  </Card>
</template>

<style lang="less" scoped>
.workbench-quick-nav {
  cursor: pointer;

  &-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-icon {
    width: 28px;
    height: 28px;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    transition-property: all;
  }

  &-title {
    margin-top: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover &-icon {
    transform: scale(1.1);
  }
}
</style>
