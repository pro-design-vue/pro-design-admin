/*
 * @Author: shen
 * @Date: 2025-06-20 09:07:13
 * @LastEditors: shen
 * @LastEditTime: 2025-06-20 09:07:27
 * @Description:
 */
import type { MenuRecordRaw } from '@/typings'
import type { ItemType } from 'ant-design-vue'

interface NormalMenuProps {
  /**
   * 菜单数据
   */
  activePath?: string
  /**
   * 是否折叠
   */
  collapse?: boolean
  /**
   * 菜单项
   */
  menus?: MenuRecordRaw[]
  /**
   * 菜单项
   */
  items?: ItemType[]
  /**
   * @zh_CN 是否圆润风格
   * @default true
   */
  rounded?: boolean
  /**
   * 主题
   */
  theme?: 'dark' | 'light'
}

export type { NormalMenuProps }
