/*
 * @Author: shen
 * @Date: 2025-06-22 16:24:58
 * @LastEditors: shen
 * @LastEditTime: 2025-06-22 16:25:12
 * @Description:
 */
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export function useIsMobile() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('md')
  return { isMobile }
}
