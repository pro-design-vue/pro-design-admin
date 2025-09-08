<!--
 * @Author: shen
 * @Date: 2025-06-11 15:02:12
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 15:50:17
 * @Description:
-->
<script lang="ts" setup>
import { ProLoading } from 'pro-design-vue'

import { useContentSpinner } from './use-content-spinner'

defineOptions({ name: 'LayoutContentSpinner' })

const { spinning } = useContentSpinner()
</script>
<template>
  <ProLoading :spinning="spinning" />
</template>
