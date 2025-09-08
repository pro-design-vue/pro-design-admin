<!--
 * @Author: shen
 * @Date: 2025-06-25 14:37:12
 * @LastEditors: shen
 * @LastEditTime: 2025-06-25 14:39:07
 * @Description:
-->
<script setup lang="ts">
import type { Component } from 'vue'

import { computed } from 'vue'

import { $t } from '@/shared/locales'

import { ContentCompact, ContentWide } from '../../icons'

defineOptions({
  name: 'PreferenceLayoutContent',
})

const modelValue = defineModel<string>({ default: 'wide' })

const components: Record<string, Component> = {
  compact: ContentCompact,
  wide: ContentWide,
}

const PRESET = computed(() => [
  {
    name: $t('preferences.wide'),
    type: 'wide',
  },
  {
    name: $t('preferences.compact'),
    type: 'compact',
  },
])

function activeClass(theme: string): string[] {
  return theme === modelValue.value ? ['outline-box-active'] : []
}
</script>

<template>
  <div class="preferences-content">
    <template v-for="theme in PRESET" :key="theme.name">
      <div class="preferences-content-item" @click="modelValue = theme.type">
        <div :class="activeClass(theme.type)" class="preferences-content-item-icon outline-box">
          <component :is="components[theme.type]" />
        </div>
        <div class="preferences-content-item-name">
          {{ theme.name }}
        </div>
      </div>
    </template>
  </div>
</template>
<style lang="less" scoped>
.preferences-content {
  display: flex;
  gap: 20px;
  width: 100%;

  &-item {
    display: flex;
    flex-direction: column;
    width: 100px;
    cursor: pointer;

    &-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-name {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 8px;
      font-size: 12px;
      line-height: 16px;
      color: hsl(var(--pro-muted-foreground));
      text-align: center;

      &:hover {
        color: hsl(var(--pro-foreground));
      }
    }
  }
}
</style>
