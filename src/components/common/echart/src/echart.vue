<script setup lang="ts">
import type { EChartsOption } from '@/shared/plugins'

import { onMounted, useTemplateRef, watch } from 'vue'
import { useEcharts } from '@/shared/plugins'

interface Props {
  height?: string
  width?: string
  options?: EChartsOption
}

defineOptions({
  name: 'ProEchart',
})

const props = withDefaults(defineProps<Props>(), {
  height: '300px',
  width: '100%',
})

const chartRef = useTemplateRef<HTMLElement>('chart')
const { renderEcharts, getChartInstance } = useEcharts(chartRef)

watch(
  () => props.options,
  (newOptions) => {
    if (newOptions) {
      renderEcharts(newOptions)
    }
  },
)

onMounted(() => {
  if (props.options) {
    renderEcharts(props.options)
  }
})

defineExpose({
  getInstance: getChartInstance,
})
</script>

<template>
  <div ref="chart" v-bind="$attrs" :style="{ height, width }"></div>
</template>
