<!--
 * @Author: shen
 * @Date: 2025-07-03 15:19:28
 * @LastEditors: shen
 * @LastEditTime: 2025-07-04 11:22:57
 * @Description:
-->
<script setup lang="ts">
import { Card, Checkbox } from 'ant-design-vue'

export interface WorkbenchTodoItem {
  completed: boolean
  content: string
  date: string
  title: string
}

interface Props {
  items?: WorkbenchTodoItem[]
  title: string
}

withDefaults(defineProps<Props>(), {
  items: () => [],
})
</script>

<template>
  <Card :title="title">
    <ul class="workbench-todo" role="list">
      <li
        v-for="item in items"
        :key="item.title"
        :class="{
          completed: item.completed,
        }"
        class="workbench-todo-item"
      >
        <Checkbox v-model:checked="item.completed" name="completed" />
        <div class="workbench-todo-item-wrap">
          <p class="workbench-todo-item-title">
            {{ item.title }}
          </p>
          <div class="workbench-todo-item-info">
            <!-- eslint-disable vue/no-v-html -->
            <p class="workbench-todo-item-content" v-html="item.content"></p>
            <span class="workbench-todo-item-date">
              {{ item.date }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </Card>
</template>

<style lang="less" scoped>
.workbench-todo {
  &-item {
    display: flex;
    column-gap: 24px;
    align-items: center;
    padding: 20px 0;
    cursor: pointer;

    &.completed {
      text-decoration-line: line-through;
      user-select: none;
      opacity: 0.6;
    }

    &-wrap {
      flex: 1 1 auto;
      min-width: 0;
    }

    &-title {
      font-size: 14px;
      font-weight: 600;
      line-height: 24px;
      color: hsl(var(--pro-foreground));
    }

    &-info {
      display: flex;
      column-gap: 24px;
      align-items: center;
      margin-top: 4px;
      font-size: 12px;
      line-height: 20px;
      color: hsl(var(--pro-foreground) / 80%);
    }

    &-content {
      flex: 1 1 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

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

    &:not(:last-child) {
      border-bottom-width: 1px;
    }
  }
}
</style>
