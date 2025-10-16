<!--
 * @Author: shen
 * @Date: 2025-06-17 09:54:18
 * @LastEditors: shen
 * @LastEditTime: 2025-10-16 10:48:40
 * @Description:
-->
<script lang="ts" setup>
import { h } from 'vue'
import { SettingsIcon } from '@/icons'

import { Button } from 'ant-design-vue'

import Preferences from './preferences.vue'

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>()
const copyrightSettingShow = defineModel<boolean>('copyrightSettingShow')

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout')
}
</script>
<template>
  <Preferences
    v-model:copyrightSettingShow="copyrightSettingShow"
    @clear-preferences-and-logout="clearPreferencesAndLogout"
  >
    <Button
      shape="circle"
      type="text"
      style="font-size: 16px; color: hsl(var(--pro-foreground))"
      :icon="h(SettingsIcon)"
    >
    </Button>
  </Preferences>
</template>
