/*
 * @Author: shen
 * @Date: 2025-08-24 09:24:45
 * @LastEditors: shen
 * @LastEditTime: 2025-08-25 09:06:01
 * @Description:
 */

import { isFunction } from '@/shared/utils'
import { onActivated, onDeactivated, onMounted, onUnmounted, watch } from 'vue'
import { preferences } from '@/shared/preferences'
import { useRoute } from 'vue-router'
import config from '@/config'

const enum LifeCycles {
  ACTICATED = 'a',
  DEACTICATED = 'd',
}

function useApplication() {
  const route = useRoute()
  const hookEffect: Map<LifeCycles, () => void> = new Map()
  const onAppActivated = (hook: () => void) => {
    if (hookEffect.has(LifeCycles.ACTICATED)) {
      return
    }

    if (!isFunction(hook)) {
      console.error('onActivated arguments is required')
      return
    }
    hookEffect.set(LifeCycles.ACTICATED, hook)
  }

  const onAppDeactivated = (hook: () => void) => {
    if (hookEffect.has(LifeCycles.DEACTICATED)) {
      return
    }

    if (!isFunction(hook)) {
      console.error('onDeactivated arguments is required')
      return
    }
    hookEffect.set(LifeCycles.DEACTICATED, hook)
  }

  onMounted(() => {
    if (config.powerByMicro && route.meta.keepAlive) {
      watch(
        () => preferences.micro.actived,
        (actived) => {
          if (actived) {
            hookEffect.get(LifeCycles.ACTICATED)?.()
          } else {
            hookEffect.get(LifeCycles.DEACTICATED)?.()
          }
        },
        {
          immediate: true,
          flush: 'post',
        },
      )
    }
  })

  onUnmounted(() => {
    hookEffect.get(LifeCycles.DEACTICATED)?.()
  })

  onActivated(() => {
    hookEffect.get(LifeCycles.ACTICATED)?.()
  })

  onDeactivated(() => {
    hookEffect.get(LifeCycles.DEACTICATED)?.()
  })

  return {
    onActivated: onAppActivated,
    onDeactivated: onAppDeactivated,
  }
}

export { useApplication }
