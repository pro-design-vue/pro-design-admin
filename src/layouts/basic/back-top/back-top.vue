<!--
 * @Author: shen
 * @Date: 2025-06-20 15:34:40
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 15:50:12
 * @Description:
-->
<script lang="ts" setup>
import type { BacktopProps } from './backtop'

import { computed } from 'vue'

import { ArrowUpToLineIcon } from '@/icons'

import { ProButton } from 'pro-design-vue'
import { useBackTop } from './use-backtop'

interface Props extends BacktopProps {}

defineOptions({ name: 'BackTop' })

const props = withDefaults(defineProps<Props>(), {
  bottom: 20,
  isGroup: false,
  right: 24,
  target: '',
  visibilityHeight: 200,
})

const backTopStyle = computed(() => ({
  bottom: `${props.bottom}px`,
  right: `${props.right}px`,
}))

const { handleClick, visible } = useBackTop(props)
</script>
<template>
  <transition name="fade-down">
    <ProButton
      type="text"
      v-if="visible"
      :style="backTopStyle"
      class="back-top"
      @click="handleClick"
    >
      <ArrowUpToLineIcon class="size-4" />
    </ProButton>
  </transition>
</template>

<style lang="less" scoped>
.back-top {
  position: fixed;
  bottom: 40px;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 16px;
  font-weight: 500;
  background-color: hsl(var(--pro-background));
  border-radius: 9999px;
  box-shadow:
    0 6px 16px 0 rgb(0 0 0 / 8%),
    0 3px 6px -4px rgb(0 0 0 / 12%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  animation-duration: 500ms;

  &:hover {
    background-color: hsl(var(--pro-heavy));
  }

  &:where(.dark, .dark *) {
    background-color: hsl(var(--pro-accent));

    &:hover {
      background-color: hsl(var(--pro-heavy));
    }
  }
}
</style>
