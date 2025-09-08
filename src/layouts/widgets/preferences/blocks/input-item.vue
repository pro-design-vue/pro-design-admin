<!--
 * @Author: shen
 * @Date: 2025-06-25 15:35:04
 * @LastEditors: shen
 * @LastEditTime: 2025-06-25 17:02:04
 * @Description:
-->
<script setup lang="ts">
import { useSlots } from 'vue'

import { CircleHelpIcon } from '@/icons'

import { Input, Tooltip } from 'ant-design-vue'

defineOptions({
  name: 'PreferenceInputItem',
})

withDefaults(
  defineProps<{
    disabled?: boolean
    placeholder?: string
  }>(),
  {
    disabled: false,
    placeholder: '',
  },
)

const inputValue = defineModel<string>()

const slots = useSlots()
</script>

<template>
  <div
    :class="{
      'input-item--hover': !slots.tip,
      'input-item--disabled': disabled,
    }"
    class="input-item"
  >
    <span class="input-item-title">
      <slot></slot>

      <Tooltip v-if="slots.tip" placement="bottom">
        <template #title>
          <slot name="tip"></slot>
        </template>
        <CircleHelpIcon class="input-item-help" />
      </Tooltip>
    </span>
    <Input v-model:value="inputValue" :disabled="disabled" style="width: 165px" />
  </div>
</template>

<style lang="less" scoped>
.input-item {
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
