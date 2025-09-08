<!--
 * @Author: shen
 * @Date: 2025-06-16 15:21:45
 * @LastEditors: shen
 * @LastEditTime: 2025-07-01 15:49:09
 * @Description:
-->
<script setup lang="ts">
import type { Component } from 'vue'

import { computed } from 'vue'

import { DefaultIcon, IconifyIcon } from '@/icons'
import { isFunction, isHttpUrl, isObject, isString } from '@/shared/utils'

const props = defineProps<{
  // 没有是否显示默认图标
  fallback?: boolean
  icon?: Component | (() => void) | string
}>()

const isRemoteIcon = computed(() => {
  return isString(props.icon) && isHttpUrl(props.icon)
})

const isComponent = computed(() => {
  const { icon } = props
  return !isString(icon) && (isObject(icon) || isFunction(icon))
})
</script>

<template>
  <component :is="icon as Component" v-if="isComponent" v-bind="$attrs" />
  <img v-else-if="isRemoteIcon" :src="icon as string" v-bind="$attrs" />
  <IconifyIcon inline v-else-if="icon" v-bind="$attrs" :icon="icon as string" />
  <DefaultIcon v-else-if="fallback" v-bind="$attrs" />
</template>
