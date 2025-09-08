<!--
 * @Author: shen
 * @Date: 2025-06-26 14:54:39
 * @LastEditors: shen
 * @LastEditTime: 2025-06-26 15:45:23
 * @Description:
-->
<script setup lang="ts">
import type { ToolbarType } from './types'

import { computed } from 'vue'

import { preferences } from '@/shared/preferences'

import {
  AuthenticationColorToggle,
  AuthenticationLayoutToggle,
  LanguageToggle,
  ThemeToggle,
} from '../../widgets'

interface Props {
  toolbarList?: ToolbarType[]
}

defineOptions({
  name: 'AuthenticationToolbar',
})

const props = withDefaults(defineProps<Props>(), {
  toolbarList: () => ['color', 'language', 'layout', 'theme'],
})

const showColor = computed(() => props.toolbarList.includes('color'))
const showLayout = computed(() => props.toolbarList.includes('layout'))
const showLanguage = computed(() => props.toolbarList.includes('language'))
const showTheme = computed(() => props.toolbarList.includes('theme'))
</script>

<template>
  <div v-if="toolbarList.length > 1" class="authentication-toolbar">
    <!-- Only show on medium and larger screens -->
    <div class="authentication-toolbar-hidden">
      <AuthenticationColorToggle v-if="showColor" />
      <AuthenticationLayoutToggle v-if="showLayout" />
    </div>
    <!-- Always show Language and Theme toggles -->
    <LanguageToggle v-if="showLanguage && preferences.widget.languageToggle" />
    <ThemeToggle v-if="showTheme && preferences.widget.themeToggle" />
  </div>
</template>

<style lang="less" scoped>
.authentication-toolbar {
  position: absolute;
  top: 16px;
  right: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  background-color: hsl(var(--pro-accent));
  border-radius: 24px;

  @media (min-width: 768px) {
    .authentication-toolbar-hidden {
      display: flex !important;
    }
  }

  &-hidden {
    display: none;
  }
}
</style>
