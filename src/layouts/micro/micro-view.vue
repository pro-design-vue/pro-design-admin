<!--
 * @Author: shen
 * @Date: 2025-08-13 15:43:41
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 15:50:54
 * @Description:
-->
<script setup lang="ts">
import type { RouteLocationNormalized } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, toRaw } from 'vue'
import { ProLoading, useProLayoutInject } from 'pro-design-vue'
import { preferences } from '@/shared/preferences'
import { useAuthStore } from '@/stores'
import { ProFallback } from '@/components/common'
interface Props {
  tab: RouteLocationNormalized
}

defineOptions({
  name: 'MicroView',
})

const props = defineProps<Props>()

const loading = ref(true)
const error = ref(false)
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { contentOffsetTop } = useProLayoutInject()

const microData = computed(() => ({
  appName: props.tab.meta.appName,
  path: route.path.replace(`/${props.tab.meta.appName}`, ''),
  preferences: toRaw(preferences),
  accessToken: authStore.accessToken,
  userInfo: toRaw(authStore.userInfo),
  locale: preferences.app.locale,
  contentOffsetTop: contentOffsetTop.value,
  microName: `${props.tab.meta.appName}-${props.tab.name as string}`,
  tabName: props.tab.name,
  actived: route.name === props.tab.name,
  theme: toRaw(preferences.theme),
  url: props.tab.meta.microUrl,
  baseroute: `/${props.tab.meta.appName}`,
  route: toRaw(route),
  router,
}))
const handleError = () => {
  loading.value = false
  error.value = true
}
</script>
<template>
  <ProLoading :spinning="loading" style="height: 100%" />
  <ProFallback v-if="error" status="500" />
  <micro-app
    :url="tab.meta.microUrl"
    :baseroute="`/${tab.meta.appName}`"
    :name="`${tab.meta.appName}-${tab.name as string}`"
    iframe
    ignore=""
    clear-data
    :data="microData"
    class="micro-view"
    :style="{ display: error ? 'none' : 'block' }"
    @mounted="loading = false"
    @error="handleError"
  />
</template>

<style scoped lang="less">
.micro-view {
  width: 100%;
  height: 100%;
}
</style>
