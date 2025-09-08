/*
 * @Author: shen
 * @Date: 2023-08-29 13:35:49
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 11:34:51
 * @Description:
 */
import { cloneVNode, type VNode, type VNodeProps, Fragment } from 'vue'

interface RefObject extends Function {
  current?: any
}

type NodeProps = Record<string, any> &
  Omit<VNodeProps, 'ref'> & { ref?: VNodeProps['ref'] | RefObject }

export function isValidElement(element) {
  if (Array.isArray(element) && element.length === 1) {
    element = element[0]
  }
  return element?.__v_isVNode && typeof element.type !== 'symbol' // remove text node
}

export function isEmptyElement(c) {
  return (
    c &&
    (c.type === Comment ||
      (c.type === Fragment && c.children.length === 0) ||
      (c.type === Text && c.children.trim() === ''))
  )
}

export function filterEmpty(children: any[] = []) {
  const res: any[] = []
  children.forEach((child: any) => {
    if (Array.isArray(child)) {
      res.push(...child)
    } else if (child?.type === Fragment) {
      res.push(...filterEmpty(child.children))
    } else {
      res.push(child)
    }
  })
  return res.filter((c) => !isEmptyElement(c) && isValidElement(c))
}

export function cloneElement<T, U>(
  vnode: VNode<T, U> | VNode<T, U>[],
  nodeProps: NodeProps = {},
  override = true,
  mergeRef = false,
): VNode<T, U> | null {
  let ele = vnode
  if (Array.isArray(vnode)) {
    ele = filterEmpty(vnode)[0]
  }
  if (!ele) {
    return null
  }
  const node = cloneVNode(ele as VNode<T, U>, nodeProps as any, mergeRef)

  // cloneVNode内部是合并属性，这里改成覆盖属性
  node.props = (override ? { ...node.props, ...nodeProps } : node.props) as any
  return node
}

export default cloneElement
