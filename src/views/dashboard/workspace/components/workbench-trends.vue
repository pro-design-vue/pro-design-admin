<!--
 * @Author: shen
 * @Date: 2025-07-03 14:51:09
 * @LastEditors: shen
 * @LastEditTime: 2025-07-04 11:21:44
 * @Description:
-->
<script setup lang="ts">
import { ProIcon } from '@/components/common'
import { Card, List } from 'ant-design-vue'

export interface WorkbenchTrendItem {
  avatar: string
  content: string
  date: string
  title: string
}

interface Props {
  items?: WorkbenchTrendItem[]
  title: string
}

defineOptions({
  name: 'WorkbenchTrends',
})

withDefaults(defineProps<Props>(), {
  items: () => [],
})
</script>

<template>
  <Card :title="title">
    <List item-layout="horizontal" :data-source="items">
      <template #renderItem="{ item }">
        <List.Item style="padding-inline: 0">
          <List.Item.Meta>
            <template #title>
              {{ item.title }}
            </template>
            <template #avatar>
              <ProIcon :icon="item.avatar" alt="" style="width: 40px; height: 40px" />
            </template>
            <template #description>
              <div class="workbench-trends-content">
                <span v-html="item.content"></span>
                <span class="workbench-trends-date">{{ item.date }}</span>
              </div>
            </template>
          </List.Item.Meta>
        </List.Item>
      </template>
    </List>
  </Card>
</template>

<style lang="less" scoped>
.workbench-trends {
  &-content {
    display: flex;
    justify-content: space-between;

    ::v-deep(a) {
      color: hsl(var(--pro-primary));
    }
  }

  &-date {
    display: none;
    flex-shrink: 0;

    @media (min-width: 640px) {
      & {
        display: block;
      }
    }
  }
}
</style>
