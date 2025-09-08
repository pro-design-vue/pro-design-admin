<!--
 * @Author: shen
 * @Date: 2025-06-25 14:45:49
 * @LastEditors: shen
 * @LastEditTime: 2025-06-25 16:02:52
 * @Description:
-->
<script setup lang="ts">
import type { LayoutType } from '@/typings'

import { onMounted } from 'vue'

import { $t } from '@/shared/locales'

import CheckboxItem from '../checkbox-item.vue'
import NumberFieldItem from '../number-field-item.vue'
import SwitchItem from '../switch-item.vue'

defineProps<{ currentLayout?: LayoutType; disabled: boolean }>()

const sidebarEnable = defineModel<boolean>('sidebarEnable')
const sidebarWidth = defineModel<number>('sidebarWidth')
const sidebarAutoActivateChild = defineModel<boolean>('sidebarAutoActivateChild')
const sidebarCollapsed = defineModel<boolean>('sidebarCollapsed')
const sidebarExpandOnHover = defineModel<boolean>('sidebarExpandOnHover')

const sidebarButtons = defineModel<string[]>('sidebarButtons', { default: [] })
const sidebarCollapsedButton = defineModel<boolean>('sidebarCollapsedButton')
const sidebarFixedButton = defineModel<boolean>('sidebarFixedButton')

onMounted(() => {
  const newSidebarButtons: string[] = []
  if (sidebarCollapsedButton.value && !sidebarButtons.value.includes('collapsed')) {
    newSidebarButtons.push('collapsed')
  }
  if (sidebarFixedButton.value && !sidebarButtons.value.includes('fixed')) {
    newSidebarButtons.push('fixed')
  }
  sidebarButtons.value = [...newSidebarButtons]
})

const handleCheckboxChange = () => {
  sidebarCollapsedButton.value = !!sidebarButtons.value.includes('collapsed')
  sidebarFixedButton.value = !!sidebarButtons.value.includes('fixed')
}
</script>

<template>
  <SwitchItem v-model="sidebarEnable" :disabled="disabled">
    {{ $t('preferences.sidebar.visible') }}
  </SwitchItem>
  <SwitchItem v-model="sidebarCollapsed" :disabled="!sidebarEnable || disabled">
    {{ $t('preferences.sidebar.collapsed') }}
  </SwitchItem>
  <SwitchItem
    v-model="sidebarExpandOnHover"
    :disabled="!sidebarEnable || disabled || !sidebarCollapsed"
    :tip="$t('preferences.sidebar.expandOnHoverTip')"
  >
    {{ $t('preferences.sidebar.expandOnHover') }}
  </SwitchItem>
  <SwitchItem
    v-model="sidebarAutoActivateChild"
    :disabled="
      !sidebarEnable ||
      !['sidebar-mixed-nav', 'mixed-nav', 'header-mixed-nav'].includes(currentLayout as string) ||
      disabled
    "
    :tip="$t('preferences.sidebar.autoActivateChildTip')"
  >
    {{ $t('preferences.sidebar.autoActivateChild') }}
  </SwitchItem>
  <CheckboxItem
    :items="[
      { label: $t('preferences.sidebar.buttonCollapsed'), value: 'collapsed' },
      { label: $t('preferences.sidebar.buttonFixed'), value: 'fixed' },
    ]"
    :disabled="disabled"
    v-model="sidebarButtons"
    @change="handleCheckboxChange"
  >
    {{ $t('preferences.sidebar.buttons') }}
  </CheckboxItem>
  <NumberFieldItem
    v-model="sidebarWidth"
    :disabled="!sidebarEnable || disabled"
    :max="320"
    :min="160"
    :step="10"
  >
    {{ $t('preferences.sidebar.width') }}
  </NumberFieldItem>
</template>
