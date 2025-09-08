/*
 * @Author: shen
 * @Date: 2025-07-04 13:26:32
 * @LastEditors: shen
 * @LastEditTime: 2025-07-04 15:45:09
 * @Description:
 */
import { withInstall } from '@/shared/utils'
import Fallback from './src/fallback.vue'
import './style'
import type { SFCWithInstall } from '@/typings'

export const ProFallback: SFCWithInstall<typeof Fallback> = withInstall(Fallback)
export default ProFallback
