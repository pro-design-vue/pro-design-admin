/*
 * @Author: shen
 * @Date: 2025-05-27 16:33:17
 * @LastEditors: shen
 * @LastEditTime: 2025-08-22 17:22:14
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    meta: {
      keepAlive: true,
      order: 1000,
      title: '事例',
    },
    name: 'Demos',
    path: '/demos',
    redirect: '/demos/form',
    children: [
      {
        meta: {
          title: '表格',
          keepAlive: true,
        },
        name: 'Table',
        path: '/demos/table',
        component: () => import('@/views/demos/table/index.vue'),
      },
      {
        meta: {
          title: '表单',
          keepAlive: true,
        },
        name: 'Form',
        path: '/demos/form',
        component: () => import('@/views/demos/form/index.vue'),
      },
    ],
  },
]

export default routes
