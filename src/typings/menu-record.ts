/*
 * @Author: shen
 * @Date: 2025-06-05 13:47:07
 * @LastEditors: shen
 * @LastEditTime: 2025-06-20 09:09:03
 * @Description:
 */
import type { VNode } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 扩展路由原始对象
 */
type ExRouteRecordRaw = RouteRecordRaw & {
  parent?: string
  parents?: string[]
  path?: any
}

/**
 * 菜单原始对象
 */
interface MenuRecordRaw {
  /**
   * 子菜单
   */
  children?: MenuRecordRaw[]
  /**
   * 图标名
   */
  icon?: VNode | string

  /**
   * 激活图标名
   */
  activeIcon?: VNode | string
  /**
   * 菜单名
   */
  label: string
  /**
   * 菜单名
   */
  title: string
  /**
   * 菜单路径，唯一，可当作key
   */
  key: string
  /**
   * 菜单路径，唯一，可当作key
   */
  path: string
  /**
   * 父级路径
   */
  parent?: string
  /**
   * 所有父级路径
   */
  parents?: string[]
}

export type { ExRouteRecordRaw, MenuRecordRaw }
