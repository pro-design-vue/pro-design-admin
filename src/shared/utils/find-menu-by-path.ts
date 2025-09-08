/*
 * @Author: shen
 * @Date: 2025-06-16 13:58:30
 * @LastEditors: shen
 * @LastEditTime: 2025-06-19 16:43:29
 * @Description:
 */
import type { MenuRecordRaw } from '@/typings'

function findMenuByPath(list: MenuRecordRaw[], path?: string): MenuRecordRaw | null {
  for (const menu of list) {
    if (menu.key === path) {
      return menu
    }
    const findMenu = menu.children && findMenuByPath(menu.children, path)
    if (findMenu) {
      return findMenu
    }
  }
  return null
}

/**
 * 查找根菜单
 * @param menus
 * @param path
 */
function findRootMenuByPath(menus: MenuRecordRaw[], path?: string, level = 0) {
  const findMenu = findMenuByPath(menus, path)
  const rootMenuPath = findMenu?.parents?.[level]
  const rootMenu = rootMenuPath ? menus.find((item) => item.key === rootMenuPath) : undefined
  return {
    findMenu,
    rootMenu,
    rootMenuPath,
  }
}

export { findMenuByPath, findRootMenuByPath }
