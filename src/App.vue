<!--
 * @Author: shen
 * @Date: 2025-05-14 13:36:49
 * @LastEditors: shen
 * @LastEditTime: 2025-10-16 11:20:07
 * @Description:
-->
<script lang="ts" setup>
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
</script>

<template>
  <ProConfigProvider
    :dark="isDark"
    :compact="preferences.app.compact"
    :locale="antdLocale"
    :token="preferences.theme"
    :content-offset-top="contentOffsetTop"
    :prefix-cls="config.antdPrefixCls"
  >
    <RouterView />
  </ProConfigProvider>
</template>
