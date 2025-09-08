/*
 * @Author: shen
 * @Date: 2022-04-12 15:45:46
 * @LastEditors: shen
 * @LastEditTime: 2022-11-04 10:52:18
 * @Description:
 */
import type { Directive } from 'vue'
import ResizeObserver from 'resize-observer-polyfill'

type ResizableElement = HTMLElement & {
  __resizeObserver__listeners?: ResizeObserver
  __resizeObserver__rect?: {
    height: number
    width: number
  }
}

function resizeHandler(
  target: ResizableElement,
  arg: string | undefined,
  rect: DOMRect | { height: number; width: number },
  cacheRect: { height?: number; width?: number },
) {
  const { width, height } = rect
  const { width: oldWidth, height: oldHeight } = cacheRect

  const newWidth = Math.floor(width)
  const newHeight = Math.floor(height)

  if (arg === 'width') {
    if (newWidth !== oldWidth) {
      target.dispatchEvent(new CustomEvent('resizewidth', { detail: { width: newWidth } }))
    }
  } else if (arg === 'height') {
    if (newHeight !== oldHeight) {
      target.dispatchEvent(new CustomEvent('resizeheight', { detail: { height: newHeight } }))
    }
  } else if (newWidth !== oldWidth || newHeight !== oldHeight) {
    target.dispatchEvent(
      new CustomEvent('resize', { detail: { width: newWidth, height: newHeight } }),
    )
  }
  target.__resizeObserver__rect = { width: newWidth, height: newHeight }
}

function resizeDisconnect(el: any) {
  if (el.__resizeObserver__listeners) {
    el.__resizeObserver__listeners.unobserve(el)
    el.__resizeObserver__listeners.disconnect()
    el.__resizeObserver__listeners = null
  }
}

function resizeCallbackFactory(arg: string | undefined): ResizeObserverCallback {
  return function (entries: ResizeObserverEntry[]) {
    const target = entries[0].target as ResizableElement
    resizeHandler(target, arg, target.getBoundingClientRect(), target.__resizeObserver__rect || {})
  }
}

export const resize: Directive = {
  created(el, binding) {
    const { arg, value = true } = binding
    if (value) {
      const resizeObserver: ResizeObserver = new ResizeObserver(resizeCallbackFactory(arg))
      resizeObserver.observe(el)
      el.__resizeObserver__listeners = resizeObserver
    }
  },
  updated(el, binding) {
    const { arg, value = true } = binding
    if (value && !el.__resizeObserver__listeners) {
      const resizeObserver: ResizeObserver = new ResizeObserver(resizeCallbackFactory(arg))
      resizeObserver.observe(el)
      el.__resizeObserver__listeners = resizeObserver
    } else if (!value) {
      resizeDisconnect(el)
    }
  },
  beforeUnmount(el, binding) {
    const { arg, value = true } = binding
    if (value) {
      resizeHandler(el, arg, { width: 0, height: 0 }, el.__resizeObserver__rect || {})
      resizeDisconnect(el)
    }
  },
}
export default resize
