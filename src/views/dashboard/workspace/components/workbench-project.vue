<!--
 * @Author: shen
 * @Date: 2025-07-03 13:16:45
 * @LastEditors: shen
 * @LastEditTime: 2025-07-04 09:55:47
 * @Description:
-->
<script setup lang="ts">
import type { Component } from 'vue'

import { Card } from 'ant-design-vue'
import { ProIcon } from '@/components/common'

export interface WorkbenchProjectItem {
  color?: string
  content: string
  date: string
  group: string
  icon: Component | string
  title: string
  url?: string
}

interface Props {
  items?: WorkbenchProjectItem[]
  title: string
}

withDefaults(defineProps<Props>(), {
  items: () => [],
})

defineEmits(['click'])
</script>

<template>
  <Card :title="title">
    <template v-for="item in items" :key="item.title">
      <Card.Grid class="workbench-project" @click="$emit('click', item)">
        <div class="workbench-project-head">
          <ProIcon
            :color="item.color"
            :icon="item.icon"
            class="workbench-project-icon"
            @click="$emit('click', item)"
          />
          <span class="workbench-project-title">{{ item.title }}</span>
        </div>
        <div class="workbench-project-content">
          {{ item.content }}
        </div>
        <div class="workbench-project-info">
          <span>{{ item.group }}</span>
          <span>{{ item.date }}</span>
        </div>
      </Card.Grid>
    </template>
  </Card>
</template>

<style lang="less" scoped>
.workbench-project {
  width: 100%;
  cursor: pointer;

  &-head {
    display: flex;
    align-items: center;
  }

  &-icon {
    width: 32px;
    height: 32px;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    transition-property: all;
  }

  &-title {
    margin-left: 16px;
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
  }

  &-content {
    display: flex;
    height: 40px;
    margin-top: 16px;
    color: hsl(var(--pro-foreground) / 80%);
  }

  &-info {
    display: flex;
    justify-content: space-between;
    color: hsl(var(--pro-foreground) / 80%);
  }

  &:hover &-icon {
    transform: scale(1.1);
  }

  @media (min-width: 768px) {
    & {
      width: 50%;
    }
  }

  @media (min-width: 1024px) {
    & {
      width: 33.3333%;
    }
  }
}
</style>
