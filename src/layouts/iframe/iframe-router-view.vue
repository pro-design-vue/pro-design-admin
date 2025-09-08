<!--
 * @Author: shen
 * @Date: 2025-06-11 14:17:11
 * @LastEditors: shen
 * @LastEditTime: 2025-08-20 17:02:43
 * @Description:
-->
<script lang="ts" setup>
import type { RouteLocationNormalized } from 'vue-router'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { preferences } from '@/shared/preferences'
import { useTabbarStore } from '@/stores'

import IframeView from './iframe-view.vue'

interface Props {
  loadedRouteMap: Set<string>
}

defineOptions({ name: 'IFrameRouterView' })

const props = defineProps<Props>()
const tabbarStore = useTabbarStore()
const route = useRoute()

const enableTabbar = computed(() => preferences.tabbar.enable)

const iframeRoutes = computed(() => {
  if (!enableTabbar.value) {
    return route.meta.iframeSrc ? [route] : []
  }
  return tabbarStore.getTabs.filter((tab) => !!tab.meta?.iframeSrc && !tab.meta?.microUrl)
})

const tabNames = computed(() => new Set(iframeRoutes.value.map((item) => item.name as string)))

const showIframe = computed(() => iframeRoutes.value.length > 0)

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
  return (
    tabbarStore.getTabs.some((tab) => tab.name === name) && props.loadedRouteMap.has(name as string)
  )
}
</script>
<template>
  <template v-if="showIframe">
    <template v-for="item in iframeRoutes" :key="item.fullPath">
      <div v-if="canRender(item)" v-show="routeShow(item)" class="iframe-router-view">
        <IframeView :tab="item" />
      </div>
    </template>
  </template>
</template>

<style lang="less" scoped>
.iframe-router-view {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
