<!--
 * @Author: shen
 * @Date: 2025-06-24 17:26:06
 * @LastEditors: shen
 * @LastEditTime: 2025-06-24 17:27:43
 * @Description:
-->
<script setup lang="ts">
interface Props {
  title?: string
}

defineOptions({
  name: 'PreferenceBlock',
})

withDefaults(defineProps<Props>(), {
  title: '',
})
</script>

<template>
  <div class="preferences-block">
    <h3 class="preferences-block-title">
      {{ title }}
    </h3>
    <slot></slot>
  </div>
</template>

<style scoped lang="less">
.preferences-block {
  display: flex;
  flex-direction: column;
  padding: 16px 0;

  &-title {
    margin-bottom: 12px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.025em;
  }
}
</style>
