import {
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue'

import { useDebounceFn } from '@vueuse/core'
import type { RouteLocationNormalizedGeneric } from 'vue-router'
import type { TabsStyleType } from '@/typings'

export function useTabsViewScroll({
  tabs,
  active,
  styleType,
}: {
  active: ComputedRef<string>
  styleType: ComputedRef<TabsStyleType>
  tabs: Ref<RouteLocationNormalizedGeneric[] | undefined>
}) {
  let resizeObserver: null | ResizeObserver = null
  let mutationObserver: MutationObserver | null = null
  let tabItemCount = 0
  const scrollRef = useTemplateRef<HTMLElement>('scrollRef')
  const scrollWrapRef = useTemplateRef<HTMLElement>('scrollWrapRef')
  const showScrollButton = ref(false)
  const scrollIsAtLeft = ref(true)
  const scrollIsAtRight = ref(false)

  function getScrollClientWidth() {
    const scrollbarEl = scrollRef.value
    if (!scrollbarEl || !scrollWrapRef.value) return {}

    const scrollbarWidth = scrollbarEl.clientWidth
    const scrollViewWidth = scrollWrapRef.value.clientWidth

    return {
      scrollbarWidth,
      scrollViewWidth,
    }
  }

  function scrollDirection(direction: 'left' | 'right', distance: number = 150) {
    const { scrollbarWidth, scrollViewWidth } = getScrollClientWidth()

    if (!scrollbarWidth || !scrollViewWidth) return

    if (scrollbarWidth > scrollViewWidth) return

    scrollWrapRef.value?.scrollBy({
      behavior: 'smooth',
      left: direction === 'left' ? -(scrollbarWidth - distance) : +(scrollbarWidth - distance),
    })
  }

  async function initScrollbar() {
    await nextTick()

    const scrollbarEl = scrollRef.value
    const viewportEl = scrollWrapRef.value
    if (!scrollbarEl || !viewportEl) {
      return
    }

    calcShowScrollbarButton()

    await nextTick()
    scrollToActiveIntoView()

    // 监听大小变化
    resizeObserver?.disconnect()
    resizeObserver = new ResizeObserver(
      useDebounceFn((_entries: ResizeObserverEntry[]) => {
        calcShowScrollbarButton()
        scrollToActiveIntoView()
      }, 100),
    )

    resizeObserver.observe(viewportEl!)

    tabItemCount = tabs.value?.length || 0
    mutationObserver?.disconnect()
    // 使用 MutationObserver 仅监听子节点数量变化
    mutationObserver = new MutationObserver(() => {
      const count = viewportEl!.querySelectorAll(`div[data-tab-item="true"]`).length

      if (count > tabItemCount) {
        scrollToActiveIntoView()
      }

      if (count !== tabItemCount) {
        calcShowScrollbarButton()
        tabItemCount = count
      }
    })

    // 配置为仅监听子节点的添加和移除
    mutationObserver.observe(viewportEl!, {
      attributes: false,
      childList: true,
      subtree: true,
    })
  }

  async function scrollToActiveIntoView() {
    if (!scrollWrapRef.value) {
      return
    }

    await nextTick()
    const viewportEl = scrollWrapRef.value
    const { scrollbarWidth } = getScrollClientWidth()

    if (scrollbarWidth! >= viewportEl?.scrollWidth) {
      return
    }
    requestAnimationFrame(() => {
      const activeItem = viewportEl?.querySelector('.is-active')
      activeItem?.scrollIntoView({ behavior: 'smooth', inline: 'start' })
    })
  }

  /**
   * 计算tabs 宽度，用于判断是否显示左右滚动按钮
   */
  async function calcShowScrollbarButton() {
    if (!scrollWrapRef.value) {
      return
    }

    const { scrollbarWidth } = getScrollClientWidth()

    showScrollButton.value = scrollWrapRef.value.scrollWidth > scrollbarWidth!
  }

  const handleScrollAt = useDebounceFn(() => {
    const { scrollLeft, clientWidth, scrollWidth } = scrollWrapRef.value ?? {}
    if (scrollLeft! + clientWidth! === scrollWidth) {
      scrollIsAtRight.value = true
    } else {
      scrollIsAtRight.value = false
    }
    scrollIsAtLeft.value = !scrollLeft
  }, 100)

  function handleWheel({ deltaY }: WheelEvent) {
    scrollWrapRef.value?.scrollBy({
      // behavior: 'smooth',
      left: deltaY * 3,
    })
  }

  watch(
    active,
    async () => {
      // 200为了等待 tab 切换动画完成
      // setTimeout(() => {
      scrollToActiveIntoView()
      // }, 300);
    },
    {
      flush: 'post',
    },
  )

  watch(styleType, () => {
    initScrollbar()
  })

  onMounted(initScrollbar)

  onUnmounted(() => {
    resizeObserver?.disconnect()
    mutationObserver?.disconnect()
    resizeObserver = null
    mutationObserver = null
  })

  return {
    handleScrollAt,
    handleWheel,
    initScrollbar,
    scrollRef,
    scrollWrapRef,
    scrollDirection,
    scrollIsAtLeft,
    scrollIsAtRight,
    showScrollButton,
  }
}
