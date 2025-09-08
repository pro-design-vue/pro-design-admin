<!--
 * @Author: shen
 * @Date: 2025-06-25 17:03:33
 * @LastEditors: shen
 * @LastEditTime: 2025-06-25 17:03:48
 * @Description:
-->
<script setup lang="ts">
import { computed } from 'vue'

import { $t } from '@/shared/locales'
import { isWindowsOs } from '@/shared/utils'

import SwitchItem from '../switch-item.vue'

defineOptions({
  name: 'PreferenceGeneralConfig',
})

const shortcutKeysEnable = defineModel<boolean>('shortcutKeysEnable')
const shortcutKeysGlobalSearch = defineModel<boolean>('shortcutKeysGlobalSearch')
const shortcutKeysLogout = defineModel<boolean>('shortcutKeysLogout')
const shortcutKeysLockScreen = defineModel<boolean>('shortcutKeysLockScreen')

const altView = computed(() => (isWindowsOs() ? 'Alt' : '⌥'))
</script>

<template>
  <SwitchItem v-model="shortcutKeysEnable">
    {{ $t('preferences.shortcutKeys.title') }}
  </SwitchItem>
  <SwitchItem v-model="shortcutKeysGlobalSearch" :disabled="!shortcutKeysEnable">
    {{ $t('preferences.shortcutKeys.search') }}
    <template #shortcut>
      {{ isWindowsOs() ? 'Ctrl' : '⌘' }}
      <kbd> K </kbd>
    </template>
  </SwitchItem>
  <SwitchItem v-model="shortcutKeysLogout" :disabled="!shortcutKeysEnable">
    {{ $t('preferences.shortcutKeys.logout') }}
    <template #shortcut> {{ altView }} Q </template>
  </SwitchItem>
  <SwitchItem v-model="shortcutKeysLockScreen" :disabled="!shortcutKeysEnable">
    {{ $t('ui.widgets.lockScreen.title') }}
    <template #shortcut> {{ altView }} L </template>
  </SwitchItem>
</template>
