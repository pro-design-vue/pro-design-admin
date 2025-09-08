/*
 * @Author: shen
 * @Date: 2025-06-16 11:10:42
 * @LastEditors: shen
 * @LastEditTime: 2025-06-16 11:10:50
 * @Description:
 */
import { useRouter } from 'vue-router'

import { useTabbarStore } from '@/stores'

export function useRefresh() {
  const router = useRouter()
  const tabbarStore = useTabbarStore()

  async function refresh() {
    await tabbarStore.refresh(router)
  }

  return {
    refresh,
  }
}
