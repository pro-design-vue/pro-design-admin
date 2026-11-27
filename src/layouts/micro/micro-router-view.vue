<!--
 * @Author: shen
 * @Date: 2025-06-11 14:17:11
 * @LastEditors: shen
 * @LastEditTime: 2025-08-18 10:14:42
 * @Description:
-->
<script lang="ts" setup>
import type { RouteLocationNormalized } from 'vue-router'

import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { preferences } from '@/shared/preferences'
import { useTabbarStore } from '@/stores'
import MicroView from './micro-view.vue'

interface Props {
  loadedRouteMap: Set<string>
}

defineOptions({ name: 'MicroRouterView' })
const props = defineProps<Props>()

const tabbarStore = useTabbarStore()
const route = useRoute()

const enableTabbar = computed(() => preferences.tabbar.enable)

const microRoutes = computed(() => {
  if (!enableTabbar.value) {
    return route.meta.microUrl ? [route] : []
  }
  return tabbarStore.getTabs.filter((tab) => !!tab.meta?.microUrl)
})

const tabNames = computed(() => new Set(microRoutes.value.map((item) => item.name as string)))

const showMicro = computed(() => microRoutes.value.length > 0)

/**
 * LRU 访问时间：记录每个微应用 tab 最后一次被激活的时间戳。
 * 当前激活的 tab 时间戳始终刷新，从而自然成为"最近使用"，无需预知哪些 tab 是高频的。
 */
const accessTimeMap = ref<Map<string, number>>(new Map())
let accessSequence = 0

watch(
  () => route.name,
  (name) => {
    if (name) {
      // 用递增序号而非时间戳，避免同一毫秒内多次切换导致排序不稳定
      accessTimeMap.value.set(name as string, ++accessSequence)
    }
  },
  { immediate: true },
)

/** 按 LRU 保留最近访问的微应用 tab 名称集合 */
const keepAliveMicroNames = computed(() => {
  const max = preferences.micro.maxKeepAliveTabs
  const entries = [...accessTimeMap.value.entries()].sort((a, b) => b[1] - a[1])
  return new Set((max > 0 ? entries.slice(0, max) : entries).map(([name]) => name))
})

function routeShow(tabItem: RouteLocationNormalized) {
  return tabItem.name === route.name
}

function canRender(tabItem: RouteLocationNormalized) {
  const { meta, name } = tabItem

  if (!name || !tabbarStore.renderRouteView) {
    return false
  }

  if (!enableTabbar.value) {
    return routeShow(tabItem)
  }
  // 跟随 keepAlive 状态,与其他tab页保持一致
  if (!meta?.keepAlive && tabNames.value.has(name as string) && name !== route.name) {
    return false
  }
  // 当前激活的 tab 必须渲染；其余按 LRU 淘汰超出上限的实例
  if (!routeShow(tabItem) && !keepAliveMicroNames.value.has(name as string)) {
    return false
  }
  return (
    tabbarStore.getTabs.some((tab) => tab.name === name) && props.loadedRouteMap.has(name as string)
  )
}
</script>
<template>
  <template v-if="showMicro">
    <template v-for="item in microRoutes" :key="item.fullPath">
      <div v-if="canRender(item)" v-show="routeShow(item)" class="micro-router-view">
        <MicroView :tab="item" />
      </div>
    </template>
  </template>
</template>

<style lang="less" scoped>
.micro-router-view {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
