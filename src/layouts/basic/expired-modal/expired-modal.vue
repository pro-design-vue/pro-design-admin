<!--
 * @Author: shen
 * @Date: 2025-10-18 18:35:27
 * @LastEditors: shen
 * @LastEditTime: 2025-10-19 17:57:56
 * @Description:
-->
<script setup lang="ts">
import { computed } from 'vue'
import { ProModal } from 'pro-design-vue'
import { Avatar } from 'ant-design-vue'

interface Props {
  avatar?: string
  text?: string
  zIndex?: number
}

defineOptions({
  name: 'LoginExpiredModal',
})

const props = withDefaults(defineProps<Props>(), {
  avatar: '',
  zIndex: 0,
})

const open = defineModel<boolean>('open')

const getZIndex = computed(() => {
  return props.zIndex || calcZIndex()
})

/**
 * 排除ant-message和loading:9999的z-index
 */
const zIndexExcludeClass = ['ant-message', 'loading']
function isZIndexExcludeClass(element: Element) {
  return zIndexExcludeClass.some((className) => element.classList.contains(className))
}

/**
 * 获取最大的zIndex值
 */
function calcZIndex() {
  let maxZ = 0
  const elements = document.querySelectorAll('*')
  ;[...elements].forEach((element) => {
    const style = window.getComputedStyle(element)
    const zIndex = style.getPropertyValue('z-index')
    if (zIndex && !Number.isNaN(Number.parseInt(zIndex)) && !isZIndexExcludeClass(element)) {
      maxZ = Math.max(maxZ, Number.parseInt(zIndex))
    }
  })
  return maxZ + 1
}
</script>

<template>
  <div>
    <ProModal
      v-model:open="open"
      :closable="false"
      :mask-closable="false"
      :footer="false"
      :header="false"
      :width="600"
      :body-style="{
        padding: '50px',
      }"
      :z-index="getZIndex"
    >
      <div style="margin-bottom: 30px; text-align: center">
        <Avatar :src="avatar" :size="80" />
      </div>
      <slot />
    </ProModal>
  </div>
</template>
