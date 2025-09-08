/*
 * @Author: shen
 * @Date: 2025-05-27 09:34:14
 * @LastEditors: shen
 * @LastEditTime: 2025-06-30 15:14:22
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    meta: {
      order: -1,
      title: 'page.dashboard.title',
      icon: 'lucide:layout-dashboard',
    },
    name: 'Dashboard',
    path: '/dashboard',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: () => import('@/views/dashboard/analytics/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: () => import('@/views/dashboard/workspace/index.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: 'page.dashboard.workspace',
        },
      },
    ],
  },
]
export default routes
