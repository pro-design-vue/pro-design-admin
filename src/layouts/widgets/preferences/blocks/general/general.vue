<!--
 * @Author: shen
 * @Date: 2025-06-25 17:06:49
 * @LastEditors: shen
 * @LastEditTime: 2025-11-11 17:00:42
 * @Description:
-->
<script setup lang="ts">
import { SUPPORT_LANGUAGES } from '@/shared/constants'
import { $t } from '@/shared/locales'

import SelectItem from '../select-item.vue'
import SwitchItem from '../switch-item.vue'

defineOptions({
  name: 'PreferenceGeneralConfig',
})

const appLocale = defineModel<string>('appLocale')
const appDynamicTitle = defineModel<boolean>('appDynamicTitle')
const appWatermark = defineModel<boolean>('appWatermark')
const appEnableCheckUpdates = defineModel<boolean>('appEnableCheckUpdates')
const appEnableLanguage = defineModel<boolean>('enableLanguage')
</script>

<template>
  <SelectItem v-model="appLocale" :items="SUPPORT_LANGUAGES" v-if="appEnableLanguage">
    {{ $t('preferences.language') }}
  </SelectItem>
  <SwitchItem v-model="appDynamicTitle">
    {{ $t('preferences.dynamicTitle') }}
  </SwitchItem>
  <SwitchItem v-model="appWatermark">
    {{ $t('preferences.watermark') }}
  </SwitchItem>
  <SwitchItem v-model="appEnableCheckUpdates">
    {{ $t('preferences.checkUpdates') }}
  </SwitchItem>
</template>
