<!--
 * @Author: shen
 * @Date: 2025-06-20 15:21:27
 * @LastEditors: shen
 * @LastEditTime: 2025-06-20 15:22:54
 * @Description:
-->
<script lang="ts" setup>
defineOptions({
  name: 'LayoutFooter',
})
</script>

<template>
  <div class="layout-footer">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.layout-footer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 12px;
  line-height: 16px;
  color: hsl(var(--pro-muted-foreground));
}
</style>
