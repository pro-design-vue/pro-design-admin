/*
 * @Author: shen
 * @Date: 2022-04-12 18:33:56
 * @LastEditors: shen
 * @LastEditTime: 2022-06-12 13:54:40
 * @Description:
 */
import type { FunctionalComponent } from 'vue'

export const RenderSlot: FunctionalComponent<any> = (_, { slots }) => {
  return slots.default?.()
}
RenderSlot.displayName = 'RenderSlot'
RenderSlot.inheritAttrs = false

export const RenderVNode: FunctionalComponent<any> = (props, { slots }) => {
  if (typeof props.vnode === 'function') {
    return props.vnode?.(props.props || {}) || slots.default?.()
  } else {
    return props.vnode || slots.default?.()
  }
}
RenderVNode.props = ['vnode', 'props']
RenderVNode.inheritAttrs = false

export default RenderVNode
