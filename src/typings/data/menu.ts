/*
 * @Author: shen
 * @Date: 2025-05-27 13:49:07
 * @LastEditors: shen
 * @LastEditTime: 2025-05-28 14:00:46
 * @Description:
 */
import type { CommonData } from './common'

export interface MenuData extends CommonData {
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
  children?: MenuData[]
}

export interface MenuTreeData extends MenuData {
  title?: string
  value?: string
  children?: MenuTreeData[]
}
