/*
 * @Author: shen
 * @Date: 2025-06-22 16:23:51
 * @LastEditors: shen
 * @LastEditTime: 2025-06-22 16:23:55
 * @Description:
 */
import type { SortableOptions } from 'sortablejs'
import type Sortable from 'sortablejs'

function useSortable<T extends HTMLElement>(sortableContainer: T, options: SortableOptions = {}) {
  const initializeSortable = async () => {
    const Sortable = await import('sortablejs/modular/sortable.complete.esm.js')
    const sortable = Sortable?.default?.create?.(sortableContainer, {
      animation: 300,
      delay: 400,
      delayOnTouchOnly: true,
      ...options,
    })
    return sortable as Sortable
  }

  return {
    initializeSortable,
  }
}

export { useSortable }

export type { Sortable }
