/*
 * @Author: shen
 * @Date: 2025-07-02 11:14:28
 * @LastEditors: shen
 * @LastEditTime: 2025-07-02 13:58:07
 * @Description:
 */
import { withInstall } from '@/shared/utils'
import Echart from './src/echart.vue'
import type { SFCWithInstall } from '@/typings'

export const ProEchart: SFCWithInstall<typeof Echart> = withInstall(Echart)
export default ProEchart
