/*
 * @Author: shen
 * @Date: 2023-05-24 09:23:32
 * @LastEditors: shen
 * @LastEditTime: 2025-06-29 14:22:23
 * @Description:
 */
import type { App } from 'vue'

import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { cloneDeep } from '@/shared/utils'
export * from './modules'
export { defineStore, storeToRefs } from 'pinia'

const store = createPinia()
store.use(({ store }) => {
  const initialState = cloneDeep(store.$state)
  store.$reset = () => {
    store.$patch(initialState)
  }
})

export const setupStore = (app: App<Element>) => {
  store.use(createPersistedState())
  app.use(store)
}

export function resetAllStores() {
  if (!store) {
    console.error('Pinia is not installed')
    return
  }
  const allStores = (store as any)._s
  for (const [_key, store] of allStores) {
    store.$reset()
  }
}

export default store
