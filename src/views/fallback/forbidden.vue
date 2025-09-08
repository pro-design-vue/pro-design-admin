<!--
 * @Author: shen
 * @Date: 2025-05-27 09:23:25
 * @LastEditors: shen
 * @LastEditTime: 2025-07-04 15:57:36
 * @Description:
-->
<script setup lang="ts">
import { ProFallback } from '@/components/common'
import { useRouter } from 'vue-router'

const router = useRouter()
const handleBack = () => {
  router.push('/')
}
</script>

<template>
  <ProFallback status="403" @back="handleBack" />
</template>
