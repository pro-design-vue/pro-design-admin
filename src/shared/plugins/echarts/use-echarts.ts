import type { EChartsOption } from 'echarts'
import type { EChartsType } from 'echarts/core'
import type { Ref, ShallowRef } from 'vue'

import type { Nullable } from '@/typings'

import { computed, nextTick, watch } from 'vue'

import { usePreferences } from '@/shared/preferences'

import {
  tryOnUnmounted,
  useDebounceFn,
  useResizeObserver,
  useTimeoutFn,
  useWindowSize,
} from '@vueuse/core'

import echarts from './echarts'
import { merge } from '@/shared/utils'

type EchartsThemeType = 'dark' | 'light' | null

const darkTooltip = {
  backgroundColor: 'hsl(var(--pro-background))',
  borderColor: 'hsl(var(--pro-border))',
  textStyle: {
    color: 'hsl(var(--pro-foreground))',
  },
}

function useEcharts(
  chartRef: Readonly<ShallowRef<HTMLElement | null> | Ref<HTMLElement | undefined>>,
) {
  let chartInstance: EChartsType | null = null
  let cacheOptions: EChartsOption = {}

  const { isDark } = usePreferences()
  const { height, width } = useWindowSize()
  const resizeHandler: () => void = useDebounceFn(resize, 200)

  const getOptions = computed((): EChartsOption => {
    if (!isDark.value) {
      return {}
    }

    return {
      backgroundColor: 'transparent',
    }
  })

  const initCharts = (t?: EchartsThemeType) => {
    if (!chartRef.value) {
      return
    }
    chartInstance = echarts.init(chartRef.value!, t || isDark.value ? 'dark' : null)

    return chartInstance
  }

  const renderEcharts = (
    options: EChartsOption,
    clear = true,
  ): Promise<Nullable<echarts.ECharts>> => {
    cacheOptions = options

    const currentOptions = {
      ...options,
      ...getOptions.value,
      tooltip: isDark.value ? (merge(options.tooltip, darkTooltip) as any) : options.tooltip,
    }
    return new Promise((resolve) => {
      if (chartRef.value?.offsetHeight === 0) {
        useTimeoutFn(async () => {
          resolve(await renderEcharts(currentOptions))
        }, 30)
        return
      }
      nextTick(() => {
        useTimeoutFn(() => {
          if (!chartInstance) {
            const instance = initCharts()
            if (!instance) return
          }
          clear && chartInstance?.clear()
          chartInstance?.setOption(currentOptions)
          resolve(chartInstance)
        }, 30)
      })
    })
  }

  function resize() {
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: 'quadraticIn',
      },
    })
  }

  watch([width, height], () => {
    resizeHandler?.()
  })

  useResizeObserver(chartRef as never, resizeHandler)

  watch(isDark, () => {
    if (chartInstance) {
      chartInstance.dispose()
      initCharts()
      renderEcharts(cacheOptions)
      resize()
    }
  })

  tryOnUnmounted(() => {
    // 销毁实例，释放资源
    chartInstance?.dispose()
  })
  return {
    renderEcharts,
    resize,
    getChartInstance: () => chartInstance,
  }
}

export { useEcharts }
export type { EChartsOption, EChartsType }
