<!--
 * @Author: shen
 * @Date: 2025-06-25 09:46:47
 * @LastEditors: shen
 * @LastEditTime: 2025-06-25 17:06:04
 * @Description:
-->
<script setup lang="ts">
import { useSlots } from 'vue'

import { CircleHelpIcon } from '@/icons'

import { Switch, Tooltip } from 'ant-design-vue'

defineOptions({
  name: 'PreferenceSwitchItem',
})

withDefaults(defineProps<{ disabled?: boolean; tip?: string }>(), {
  disabled: false,
  tip: '',
})

const checked = defineModel<boolean>()

const slots = useSlots()

function handleClick() {
  checked.value = !checked.value
}

function handleSwitchClick(_, e: Event) {
  checked.value = !checked.value
  e.stopPropagation()
}
</script>

<template>
  <div
    :class="{
      'switch-item--disabled': disabled,
    }"
    class="switch-item"
    @click="handleClick"
  >
    <span class="switch-item-title">
      <slot></slot>
      <Tooltip v-if="slots.tip || tip" placement="bottom">
        <CircleHelpIcon class="switch-item-help" />
        <template #title>
          <slot name="tip">
            <template v-if="tip">
              <p v-for="(line, index) in tip.split('\n')" :key="index">
                {{ line }}
              </p>
            </template>
          </slot>
        </template>
      </Tooltip>
    </span>
    <span v-if="$slots.shortcut" class="switch-item-shortcut">
      <slot name="shortcut"></slot>
    </span>
    <Switch v-model:checked="checked" :disabled="disabled" @click="handleSwitchClick" />
  </div>
</template>

<style lang="less" scoped>
.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 8px;
  margin: 4px 0;
  border-radius: calc(var(--pro-radius) - 2px);

  &--disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &:hover {
    background-color: hsl(var(--pro-accent));
  }

  &-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 20px;
  }

  &-shortcut {
    margin-right: 8px;
    margin-left: auto;
    font-size: 12px;
    line-height: 16px;
    opacity: 0.6;
  }

  &-help {
    width: 12px;
    height: 12px;
    margin-left: 4px;
    cursor: help;
  }
}
</style>
