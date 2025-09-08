/*
 * @Author: shen
 * @Date: 2025-06-21 22:49:53
 * @LastEditors: shen
 * @LastEditTime: 2025-06-21 22:57:01
 * @Description:
 */
import { updatePreferences, usePreferences } from '@/shared/preferences'
/**
 * 主体区域最大化
 */
export function useContentMaximize() {
  const { contentIsMaximize } = usePreferences()

  function toggleMaximize() {
    const isMaximize = contentIsMaximize.value

    updatePreferences({
      header: {
        hidden: !isMaximize,
      },
      sidebar: {
        hidden: !isMaximize,
      },
    })
  }
  return {
    contentIsMaximize,
    toggleMaximize,
  }
}
