/*
 * @Author: shen
 * @Date: 2025-06-06 09:26:03
 * @LastEditors: shen
 * @LastEditTime: 2025-07-03 09:39:32
 * @Description:
 */
import { reactive, watch } from 'vue'

import { preferences } from '@/shared/preferences'
import { DEFAULT_NAMESPACE } from '@/shared/constants'

/**
 * 用于适配各个框架的设计系统
 */

export function useDesignTokens() {
  const rootStyles = getComputedStyle(document.documentElement)

  const tokens = reactive({
    borderRadius: '' as any,
    colorBgBase: '',
    colorBgContainer: '',
    colorBgElevated: '',
    colorBgLayout: '',
    colorBgMask: '',
    colorBorder: '',
    colorBorderSecondary: '',
    colorError: '',
    colorInfo: '',
    colorPrimary: '',
    colorSuccess: '',
    colorTextBase: '',
    colorText: '',
    colorTextTertiary: '',
    colorWarning: '',
    zIndexPopupBase: 2000, // 调整基础弹层层级，避免下拉等组件被弹窗或者最大化状态下的表格遮挡
  })

  const getCssVariableValue = (variable: string, isColor: boolean = true) => {
    const prefixCls = preferences?.app?.prefixCls || DEFAULT_NAMESPACE
    const value = rootStyles.getPropertyValue(`--${prefixCls}-${variable}`)
    return isColor ? `hsl(${value})` : value
  }

  watch(
    () => preferences.theme,
    () => {
      tokens.colorPrimary = getCssVariableValue('primary')

      tokens.colorInfo = getCssVariableValue('primary')

      tokens.colorError = getCssVariableValue('destructive')

      tokens.colorWarning = getCssVariableValue('warning')

      tokens.colorSuccess = getCssVariableValue('success')

      tokens.colorTextBase = getCssVariableValue('foreground')
      tokens.colorText = getCssVariableValue('foreground')
      tokens.colorTextTertiary = getCssVariableValue('muted-foreground')

      tokens.colorBorderSecondary = tokens.colorBorder = getCssVariableValue('border')

      tokens.colorBgElevated = getCssVariableValue('popover')

      tokens.colorBgContainer = getCssVariableValue('card')

      tokens.colorBgBase = getCssVariableValue('background')

      const radius = Number.parseFloat(getCssVariableValue('radius', false))
      tokens.borderRadius = radius
      tokens.colorBgLayout = getCssVariableValue('background-deep')
      tokens.colorBgMask = getCssVariableValue('overlay')
    },
    { immediate: true },
  )

  return {
    tokens,
  }
}
