<!--
 * @Author: shen
 * @Date: 2025-07-02 13:55:32
 * @LastEditors: shen
 * @LastEditTime: 2025-07-02 16:42:04
 * @Description:
-->
<script lang="ts" setup>
import type { EChartsOption } from '@/shared/plugins'
import { ProEchart } from '@/components/common'

const options: EChartsOption = {
  grid: {
    bottom: 0,
    containLabel: true,
    left: '1%',
    right: '1%',
    top: '2 %',
  },
  series: [
    {
      barMaxWidth: 80,
      // color: '#4f69fd',
      data: [3000, 2000, 3333, 5000, 3200, 4200, 3200, 2100, 3000, 5100, 6000, 3200, 4800],
      type: 'bar',
    },
  ],
  tooltip: {
    axisPointer: {
      lineStyle: {
        // color: '#4f69fd',
        width: 1,
      },
    },
    trigger: 'axis',
  },
  xAxis: {
    data: Array.from({ length: 12 }).map((_item, index) => `${index + 1}月`),
    type: 'category',
  },
  yAxis: {
    max: 8000,
    splitNumber: 4,
    type: 'value',
  },
}
</script>

<template>
  <ProEchart :options />
</template>
