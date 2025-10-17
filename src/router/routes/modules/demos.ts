/*
 * @Author: shen
 * @Date: 2025-05-27 16:33:17
 * @LastEditors: shen
 * @LastEditTime: 2025-10-17 09:21:43
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
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
      title: '表格',
      keepAlive: true,
    },
    name: 'Table01',
    path: '/demos/table01',
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

  {
    meta: {
      title: '新建',
      keepAlive: true,
    },
    name: 'CreateForm',
    path: '/demos/form/create',
    component: () => import('@/views/demos/form/index.vue'),
  },
  {
    meta: {
      title: '新建01',
      keepAlive: true,
    },
    name: 'CreateForm01',
    path: '/demos/form/create1',
    component: () => import('@/views/demos/form/index.vue'),
  },
]

export default routes
