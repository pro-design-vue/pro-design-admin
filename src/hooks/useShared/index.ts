/*
 * @Author: shen
 * @Date: 2025-05-30 09:20:20
 * @LastEditors: shen
 * @LastEditTime: 2025-05-30 13:25:41
 * @Description:
 */

import logger from '@/shared/logger'
import { localCache, sessionCache } from '@/shared/cache'
function useShared() {
  return {
    logger,
    localCache,
    sessionCache,
  }
}

export { useShared }
