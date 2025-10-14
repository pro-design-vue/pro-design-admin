<!--
 * @Author: shen
 * @Date: 2025-06-25 13:41:05
 * @LastEditors: shen
 * @LastEditTime: 2025-10-13 10:08:00
 * @Description:
-->
<script setup lang="ts">
import { RadioGroup } from 'ant-design-vue'

defineOptions({
  name: 'PreferenceColorMode',
})

const modelValue = defineModel<number | undefined>('themeBorderRadius', {
  default: 8,
})

const items = [
  { label: '0px', value: 0 },
  { label: '4px', value: 4 },
  { label: '8px', value: 8 },
  { label: '12px', value: 12 },
  { label: '16px', value: 16 },
]
</script>

<template>
  <RadioGroup
    v-model:value="modelValue"
    button-style="solid"
    :options="items"
    optionType="button"
    class="preferences-radius"
  />
</template>

<style lang="less" scoped>
.preferences-radius {
  display: flex;
  width: 100%;

  & > ::v-deep(label) {
    flex: 1;
    text-align: center;
  }
}
</style>
