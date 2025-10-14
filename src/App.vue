<!--
 * @Author: shen
 * @Date: 2025-05-14 13:36:49
 * @LastEditors: shen
 * @LastEditTime: 2025-10-13 10:12:05
 * @Description:
-->
<script lang="ts" setup>
import { computed } from 'vue'
import { ProConfigProvider } from 'pro-design-vue'
import { preferences, usePreferences } from '@/shared/preferences'
import { antdLocale } from './locales'
import config from './config'

interface Props {
  contentOffsetTop?: number
}
defineOptions({ name: 'App' })
defineProps<Props>()

const { isDark } = usePreferences()

const token = computed(() => preferences.theme)
</script>

<template>
  <ProConfigProvider
    :dark="isDark"
    :compact="preferences.app.compact"
    :locale="antdLocale"
    :token="token"
    :content-offset-top="contentOffsetTop"
    :prefix-cls="config.antdPrefixCls"
  >
    <RouterView />
  </ProConfigProvider>
</template>
