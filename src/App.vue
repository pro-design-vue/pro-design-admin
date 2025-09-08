<!--
 * @Author: shen
 * @Date: 2025-05-14 13:36:49
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 15:49:14
 * @Description:
-->
<script lang="ts" setup>
import { computed } from 'vue'
import { theme } from 'ant-design-vue'
import { ProConfigProvider } from 'pro-design-vue'
import { preferences, usePreferences } from '@/shared/preferences'
import { useDesignTokens } from './hooks'
import { antdLocale } from './locales'
import config from './config'

interface Props {
  contentOffsetTop?: number
}
defineOptions({ name: 'App' })
defineProps<Props>()

const { isDark } = usePreferences()
const { tokens } = useDesignTokens()
const tokenTheme = computed(() => {
  const algorithm = isDark.value ? [theme.darkAlgorithm] : [theme.defaultAlgorithm]

  // antd 紧凑模式算法
  if (preferences.app.compact) {
    algorithm.push(theme.compactAlgorithm)
  }

  return {
    algorithm,
    token: tokens,
  }
})
</script>

<template>
  <ProConfigProvider
    :locale="antdLocale"
    :theme="tokenTheme"
    :content-offset-top="contentOffsetTop"
    :prefix-cls="config.antdPrefixCls"
  >
    <RouterView />
  </ProConfigProvider>
</template>
