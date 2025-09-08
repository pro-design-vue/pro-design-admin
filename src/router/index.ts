/*
 * @Author: shen
 * @Date: 2025-05-12 10:43:02
 * @LastEditors: shen
 * @LastEditTime: 2025-08-22 16:43:06
 * @Description:
 */
import type { App } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { resetStaticRoutes } from './utils'
import { createRouterGuard } from './guard'
import { VITE_PUBLIC_PATH, VITE_ROUTER_HISTORY } from '@/shared/constants'

const router = createRouter({
  history:
    VITE_ROUTER_HISTORY === 'hash'
      ? createWebHashHistory(VITE_PUBLIC_PATH)
      : createWebHistory(VITE_PUBLIC_PATH),
  routes,
  scrollBehavior: (to, _from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }
    return to.hash ? { behavior: 'smooth', el: to.hash } : { left: 0, top: 0 }
  },
})

const resetRoutes = () => resetStaticRoutes(router, routes)

const setupRouter = (app: App<Element>) => {
  app.use(router)
}

// 创建路由守卫
createRouterGuard(router)

export { setupRouter, resetRoutes, router }
export default router
