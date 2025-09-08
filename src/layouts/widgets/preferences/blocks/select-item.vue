<!--
 * @Author: shen
 * @Date: 2025-06-25 15:31:38
 * @LastEditors: shen
 * @LastEditTime: 2025-06-25 16:08:19
 * @Description:
-->
<script setup lang="ts">
import type { SelectOption } from '@/typings'

import { useSlots } from 'vue'

import { CircleHelpIcon } from '@/icons'

import { Select, Tooltip } from 'ant-design-vue'

defineOptions({
  name: 'PreferenceSelectItem',
})

withDefaults(
  defineProps<{
    disabled?: boolean
    items?: SelectOption[]
    placeholder?: string
  }>(),
  {
    disabled: false,
    placeholder: '',
    items: () => [],
  },
)

const selectValue = defineModel<string>()

const slots = useSlots()
</script>

<template>
  <div
    :class="{
      'select-item--hover': !slots.tip,
      'select-item--disabled': disabled,
    }"
    class="select-item"
  >
    <span class="select-item-title">
      <slot></slot>

      <Tooltip v-if="slots.tip" placement="bottom">
        <template #title>
          <slot name="tip"></slot>
        </template>
        <CircleHelpIcon class="select-item-help" />
      </Tooltip>
    </span>
    <Select
      v-model:value="selectValue"
      style="width: 165px"
      :options="items"
      :disabled="disabled"
    />
  </div>
</template>

<style lang="less" scoped>
.select-item {
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
