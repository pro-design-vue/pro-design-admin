<!--
 * @Author: shen
 * @Date: 2025-06-22 09:22:29
 * @LastEditors: shen
 * @LastEditTime: 2025-06-22 09:22:42
 * @Description:
-->
<script lang="ts" setup>
import { FullscreenIcon, Minimize2Icon } from '@/icons'

const screen = defineModel<boolean>('screen')

function toggleScreen() {
  screen.value = !screen.value
}
</script>

<template>
  <div class="layout-tabbar-tool-sreen" @click="toggleScreen">
    <Minimize2Icon v-if="screen" />
    <FullscreenIcon v-else />
  </div>
</template>

<style lang="less" scoped>
.layout-tabbar-tool-sreen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 8px;
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  color: hsl(var(--pro-muted-foreground));
  cursor: pointer;
  border-color: hsl(var(--pro-border));
  border-left-width: 1px;

  &:hover {
    color: hsl(var(--pro-foreground));
    background-color: hsl(var(--pro-muted));
  }
}
</style>
