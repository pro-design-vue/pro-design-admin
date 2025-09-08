/*
 * @Author: shen
 * @Date: 2025-06-16 15:21:34
 * @LastEditors: shen
 * @LastEditTime: 2025-06-16 15:25:21
 * @Description:
 */
import { withInstall } from '@/shared/utils'
import Icon from './src/icon.vue'
import type { SFCWithInstall } from '@/typings'

export const ProIcon: SFCWithInstall<typeof Icon> = withInstall(Icon)
export default ProIcon
