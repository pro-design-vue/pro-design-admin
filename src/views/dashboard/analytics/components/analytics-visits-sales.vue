<!--
 * @Author: shen
 * @Date: 2025-07-02 13:55:32
 * @LastEditors: shen
 * @LastEditTime: 2025-07-03 10:29:13
 * @Description:
-->
<script lang="ts" setup>
import type { EChartsOption } from '@/shared/plugins'
import { ProEchart } from '@/components/common'

const options: EChartsOption = {
  series: [
    {
      animationDelay() {
        return Math.random() * 400
      },
      animationEasing: 'exponentialInOut',
      animationType: 'scale',
      center: ['50%', '50%'],
      color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
      data: [
        { name: '外包', value: 500 },
        { name: '定制', value: 310 },
        { name: '技术支持', value: 274 },
        { name: '远程', value: 400 },
      ].sort((a, b) => {
        return a.value - b.value
      }),
      name: '商业占比',
      radius: '80%',
      roseType: 'radius',
      type: 'pie',
    },
  ],

  tooltip: {
    trigger: 'item',
  },
}
</script>

<template>
  <ProEchart :options />
</template>
