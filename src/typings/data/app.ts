/*
 * @Author: shen
 * @Date: 2025-05-27 13:49:07
 * @LastEditors: shen
 * @LastEditTime: 2025-08-12 10:50:51
 * @Description:
 */
import type { CommonData } from './common'

export interface AppData extends CommonData {
  name?: string
  path?: string
  icon?: string
  code?: string
  parentId?: string
  orderNum?: number
  description?: string
  status?: string
  disabled?: boolean
  menuType?: 'route' | 'directory'
  hidden?: boolean
  keepAlive?: boolean
  activeMenu?: string
  elementCodes?: string[]
}
