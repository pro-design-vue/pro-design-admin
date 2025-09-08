/*
 * @Author: shen
 * @Date: 2025-06-17 15:05:44
 * @LastEditors: shen
 * @LastEditTime: 2025-06-17 15:05:49
 * @Description:
 */
import { Fragment, isVNode } from 'vue'

export function ensureValidVNode(vnodes: any): any {
  return vnodes.some(
    (vnode: any) =>
      !isVNode(vnode) ||
      (vnode.type !== Comment && !(vnode.type === Fragment && !ensureValidVNode(vnode.children))),
  )
    ? vnodes
    : null
}
