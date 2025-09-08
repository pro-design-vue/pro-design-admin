<!--
 * @Author: shen
 * @Date: 2025-06-25 17:06:49
 * @LastEditors: shen
 * @LastEditTime: 2025-06-25 17:13:19
 * @Description:
-->
<script setup lang="ts">
import { $t } from '@/shared/locales'

import SwitchItem from '../switch-item.vue'

defineOptions({
  name: 'PreferenceAnimation',
})

const transitionProgress = defineModel<boolean>('transitionProgress', {
  // 默认值
  default: false,
})
const transitionName = defineModel<string>('transitionName')
const transitionEnable = defineModel<boolean>('transitionEnable')
const transitionLoading = defineModel<boolean>('transitionLoading')

const transitionPreset = ['fade', 'fade-slide', 'fade-up', 'fade-down']

function handleClick(value: string) {
  transitionName.value = value
}
</script>

<template>
  <SwitchItem v-model="transitionProgress">
    {{ $t('preferences.animation.progress') }}
  </SwitchItem>
  <SwitchItem v-model="transitionLoading">
    {{ $t('preferences.animation.loading') }}
  </SwitchItem>
  <SwitchItem v-model="transitionEnable">
    {{ $t('preferences.animation.transition') }}
  </SwitchItem>
  <div v-if="transitionEnable" class="preferences-animation">
    <div
      v-for="item in transitionPreset"
      :key="item"
      :class="{
        'outline-box-active': transitionName === item,
      }"
      class="outline-box preferences-animation-item"
      @click="handleClick(item)"
    >
      <div :class="`${item}-slow`" class="preferences-animation-wrap"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.preferences-animation {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 0 8px;
  margin-top: 12px;
  margin-bottom: 8px;

  &-item {
    padding: 8px;
  }

  &-wrap {
    width: 48px;
    height: 40px;
    background-color: hsl(var(--pro-accent));
    border-radius: calc(var(--pro-radius) - 2px);
  }
}
</style>
