<script setup lang="ts">
import type { Component } from 'vue'

import type { LayoutType } from '@/typings'

import { computed } from 'vue'

import { CircleHelpIcon } from '@/icons'
import { $t } from '@/shared/locales'

import { Tooltip } from 'ant-design-vue'

import {
  FullContent,
  HeaderMixedNav,
  HeaderNav,
  HeaderSidebarNav,
  MixedNav,
  SidebarMixedNav,
  SidebarNav,
} from '../../icons'

interface PresetItem {
  name: string
  tip: string
  type: LayoutType
}

defineOptions({
  name: 'PreferenceLayout',
})

const modelValue = defineModel<LayoutType>({ default: 'sidebar-nav' })

const components: Record<LayoutType, Component> = {
  'full-content': FullContent,
  'header-nav': HeaderNav,
  'mixed-nav': MixedNav,
  'sidebar-mixed-nav': SidebarMixedNav,
  'sidebar-nav': SidebarNav,
  'header-mixed-nav': HeaderMixedNav,
  'header-sidebar-nav': HeaderSidebarNav,
}

const PRESET = computed((): PresetItem[] => [
  {
    name: $t('preferences.vertical'),
    tip: $t('preferences.verticalTip'),
    type: 'sidebar-nav',
  },
  {
    name: $t('preferences.twoColumn'),
    tip: $t('preferences.twoColumnTip'),
    type: 'sidebar-mixed-nav',
  },
  {
    name: $t('preferences.horizontal'),
    tip: $t('preferences.horizontalTip'),
    type: 'header-nav',
  },
  {
    name: $t('preferences.headerSidebarNav'),
    tip: $t('preferences.headerSidebarNavTip'),
    type: 'header-sidebar-nav',
  },
  {
    name: $t('preferences.mixedMenu'),
    tip: $t('preferences.mixedMenuTip'),
    type: 'mixed-nav',
  },
  {
    name: $t('preferences.headerTwoColumn'),
    tip: $t('preferences.headerTwoColumnTip'),
    type: 'header-mixed-nav',
  },
  {
    name: $t('preferences.fullContent'),
    tip: $t('preferences.fullContentTip'),
    type: 'full-content',
  },
])

function activeClass(theme: string): string[] {
  return theme === modelValue.value ? ['outline-box-active'] : []
}
</script>

<template>
  <div class="preferences-layout">
    <template v-for="theme in PRESET" :key="theme.name">
      <div class="preferences-layout-item" @click="modelValue = theme.type">
        <div :class="activeClass(theme.type)" class="preferences-layout-item-icon outline-box">
          <component :is="components[theme.type]" />
        </div>
        <div class="preferences-layout-item-name">
          {{ theme.name }}
          <Tooltip v-if="theme.tip" side="bottom">
            <template #title>
              {{ theme.tip }}
            </template>
            <CircleHelpIcon class="preferences-layout-item-help" />
          </Tooltip>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.preferences-layout {
  display: flex;
  flex-wrap: wrap;
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
