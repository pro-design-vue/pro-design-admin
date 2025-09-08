<!--
 * @Author: shen
 * @Date: 2025-06-25 13:59:34
 * @LastEditors: shen
 * @LastEditTime: 2025-06-25 13:59:43
 * @Description:
-->
<script setup lang="ts">
import { $t } from '@/shared/locales'

import SwitchItem from '../switch-item.vue'

defineOptions({
  name: 'PreferenceColorMode',
})

const appColorWeakMode = defineModel<boolean>('appColorWeakMode', {
  default: false,
})

const appColorGrayMode = defineModel<boolean>('appColorGrayMode', {
  default: false,
})
</script>

<template>
  <SwitchItem v-model="appColorWeakMode">
    {{ $t('preferences.theme.weakMode') }}
  </SwitchItem>
  <SwitchItem v-model="appColorGrayMode">
    {{ $t('preferences.theme.grayMode') }}
  </SwitchItem>
</template>
