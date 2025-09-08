<!--
 * @Author: shen
 * @Date: 2025-08-13 15:43:41
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 15:50:42
 * @Description:
-->
<script setup lang="ts">
import { type RouteLocationNormalized } from 'vue-router'

import { ref } from 'vue'
import { ProLoading } from 'pro-design-vue'
interface Props {
  tab: RouteLocationNormalized
}

defineOptions({
  name: 'IframeView',
})

defineProps<Props>()

const loading = ref(true)
</script>
<template>
  <ProLoading :spinning="loading" style="height: 100%" />
  <iframe :src="tab.meta.iframeSrc" class="iframe-view" @load="loading = false"></iframe>
</template>

<style scoped lang="less">
.iframe-view {
  width: 100%;
  height: 100%;
}
</style>
