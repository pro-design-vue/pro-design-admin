<!--
 * @Author: shen
 * @Date: 2025-06-25 14:46:26
 * @LastEditors: shen
 * @LastEditTime: 2025-06-25 15:34:12
 * @Description:
-->
<script setup lang="ts">
import type { CheckboxValueType } from 'ant-design-vue/es/checkbox/interface'
import type { SelectOption } from '@/typings'

import { useSlots } from 'vue'

import { CircleHelpIcon } from '@/icons'

import { CheckboxGroup, Tooltip } from 'ant-design-vue'

defineOptions({
  name: 'PreferenceCheckboxItem',
})

withDefaults(
  defineProps<{
    disabled?: boolean
    items?: SelectOption[]
  }>(),
  {
    disabled: false,
    items: () => [],
  },
)

const emit = defineEmits<{ change: [value: CheckboxValueType[]] }>()

const inputValue = defineModel<string[]>()

const slots = useSlots()

const handleChange = (value) => {
  emit('change', value)
}
</script>

<template>
  <div
    :class="{
      'checkbox-item--hover': !slots.tip,
      'checkbox-item--disabled': disabled,
    }"
    class="checkbox-item"
  >
    <span class="checkbox-item-title">
      <slot></slot>

      <Tooltip v-if="slots.tip" placement="bottom">
        <template #title>
          <slot name="tip"></slot>
        </template>
        <CircleHelpIcon class="checkbox-item-help" />
      </Tooltip>
    </span>
    <CheckboxGroup
      v-model:value="inputValue"
      class="checkbox-item-checkbox"
      :options="items"
      :disabled="disabled"
      @change="handleChange"
    />
  </div>
</template>

<style lang="less" scoped>
.checkbox-item {
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
