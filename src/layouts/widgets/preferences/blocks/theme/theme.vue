<!--
 * @Author: shen
 * @Date: 2025-06-25 09:22:57
 * @LastEditors: shen
 * @LastEditTime: 2025-06-25 11:10:32
 * @Description:
-->
<script setup lang="ts">
import type { Component } from 'vue'

import type { ThemeModeType } from '@/typings'

import { MoonStarIcon, SunIcon, SunMoonIcon } from '@/icons'
import { $t } from '@/shared/locales'

import SwitchItem from '../switch-item.vue'

defineOptions({
  name: 'PreferenceTheme',
})

const modelValue = defineModel<string>({ default: 'auto' })
const themeSemiDarkSidebar = defineModel<boolean>('themeSemiDarkSidebar')
const themeSemiDarkHeader = defineModel<boolean>('themeSemiDarkHeader')

const THEME_PRESET: Array<{ icon: Component; name: ThemeModeType }> = [
  {
    icon: SunIcon,
    name: 'light',
  },
  {
    icon: MoonStarIcon,
    name: 'dark',
  },
  {
    icon: SunMoonIcon,
    name: 'auto',
  },
]

function activeClass(theme: string): string[] {
  return theme === modelValue.value ? ['outline-box-active'] : []
}

function nameView(name: string) {
  switch (name) {
    case 'auto': {
      return $t('preferences.followSystem')
    }
    case 'dark': {
      return $t('preferences.theme.dark')
    }
    case 'light': {
      return $t('preferences.theme.light')
    }
  }
}
</script>

<template>
  <div class="preferences-theme">
    <template v-for="theme in THEME_PRESET" :key="theme.name">
      <div class="preferences-theme-item" @click="modelValue = theme.name">
        <div :class="activeClass(theme.name)" class="preferences-theme-item-box outline-box">
          <component :is="theme.icon" class="references-theme-item-icon" />
        </div>
        <div class="preferences-theme-item-name">
          {{ nameView(theme.name) }}
        </div>
      </div>
    </template>

    <SwitchItem
      v-model="themeSemiDarkSidebar"
      :disabled="modelValue === 'dark'"
      style="margin-top: 24px"
    >
      {{ $t('preferences.theme.darkSidebar') }}
    </SwitchItem>
    <SwitchItem v-model="themeSemiDarkHeader" :disabled="modelValue === 'dark'">
      {{ $t('preferences.theme.darkHeader') }}
    </SwitchItem>
  </div>
</template>

<style lang="less" scoped>
.preferences-theme {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;

  &-item {
    display: flex;
    flex-direction: column;
    cursor: pointer;

    &-box {
      padding-top: 16px;
      padding-bottom: 16px;
    }

    svg {
      margin: 0 36px;
    }

    &-name {
      margin-top: 8px;
      font-size: 12px;
      line-height: 16px;
      color: hsl(var(--pro-muted-foreground));
      text-align: center;
    }
  }
}
</style>
