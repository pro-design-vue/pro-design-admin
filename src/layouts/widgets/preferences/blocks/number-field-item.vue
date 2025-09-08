<!--
 * @Author: shen
 * @Date: 2025-06-25 14:46:37
 * @LastEditors: shen
 * @LastEditTime: 2025-06-25 16:08:07
 * @Description:
-->
<script setup lang="ts">
import type { SelectOption } from '@/typings'

import { useSlots } from 'vue'

import { CircleHelpIcon } from '@/icons'

import { InputNumber, Tooltip } from 'ant-design-vue'

defineOptions({
  name: 'PreferenceNumberFieldItem',
})

withDefaults(
  defineProps<{
    disabled?: boolean
    items?: SelectOption[]
    placeholder?: string
    tip?: string
  }>(),
  {
    disabled: false,
    placeholder: '',
    tip: '',
    items: () => [],
  },
)

const inputValue = defineModel<number>()

const slots = useSlots()
</script>

<template>
  <div
    :class="{
      'number-field-item--hover': !slots.tip,
      'number-field-item--disabled': disabled,
    }"
    class="number-field-item"
  >
    <span class="number-field-item-title">
      <slot></slot>

      <Tooltip v-if="slots.tip" placement="bottom">
        <template #title>
          <slot name="tip"></slot>
        </template>
        <CircleHelpIcon class="number-field-item-help" />
      </Tooltip>
    </span>
    <InputNumber v-model:value="inputValue" :disabled="disabled" />
  </div>
</template>

<style lang="less" scoped>
.number-field-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 4px 8px;
  margin: 4px 0;
  border-radius: calc(var(--pro-radius) - 2px);

  &--disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &--hover:hover {
    background-color: hsl(var(--pro-accent));
  }

  &-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 20px;
  }

  &-help {
    width: 12px;
    height: 12px;
    margin-left: 4px;
    cursor: help;
  }
}
</style>
