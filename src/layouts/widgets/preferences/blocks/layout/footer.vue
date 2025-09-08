<!--
 * @Author: shen
 * @Date: 2025-06-25 16:54:24
 * @LastEditors: shen
 * @LastEditTime: 2025-06-25 16:54:32
 * @Description:
-->
<script setup lang="ts">
import { $t } from '@/shared/locales'

import SwitchItem from '../switch-item.vue'

const footerEnable = defineModel<boolean>('footerEnable')
const footerFixed = defineModel<boolean>('footerFixed')
</script>

<template>
  <SwitchItem v-model="footerEnable">
    {{ $t('preferences.footer.visible') }}
  </SwitchItem>
  <SwitchItem v-model="footerFixed" :disabled="!footerEnable">
    {{ $t('preferences.footer.fixed') }}
  </SwitchItem>
</template>
