<!--
 * @Author: shen
 * @Date: 2025-06-16 15:05:46
 * @LastEditors: shen
 * @LastEditTime: 2025-06-17 10:20:15
 * @Description:
-->
<script lang="ts" setup>
import { h } from 'vue'
import { MaximizeIcon, MinimizeIcon } from '@/icons'

import { useFullscreen } from '@vueuse/core'

import { Button } from 'ant-design-vue'

defineOptions({ name: 'FullScreen' })

const { isFullscreen, toggle } = useFullscreen()

// 重新检查全屏状态
isFullscreen.value = !!(
  document.fullscreenElement ||
  // @ts-ignore
  document.webkitFullscreenElement ||
  // @ts-ignore
  document.mozFullScreenElement ||
  // @ts-ignore
  document.msFullscreenElement
)
</script>
<template>
  <Button
    shape="circle"
    type="text"
    style="font-size: 16px; color: hsl(var(--pro-foreground))"
    :icon="h(isFullscreen ? MinimizeIcon : MaximizeIcon)"
    @click="toggle"
  />
</template>
