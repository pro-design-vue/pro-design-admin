/*
 * @Author: shen
 * @Date: 2025-05-27 09:18:22
 * @LastEditors: shen
 * @LastEditTime: 2025-10-17 13:55:28
 * @Description:
 */
import type { RouteRecordRaw } from 'vue-router'
import { mergeRouteModules } from '../utils'
import { LOGIN_PATH } from '@/shared/constants'
import { traverseTreeValues } from '@/shared/utils'

const BasicLayout = () => import('@/layouts/basic')
const AuthPageLayout = () => import('@/layouts/auth')

const dynamicRouteFiles = import.meta.glob('./modules/**/*.ts', {
  eager: true,
})

/** 动态路由 */
const dynamicRoutes: RouteRecordRaw[] = mergeRouteModules(dynamicRouteFiles)

// 有需要可以自行打开注释，并创建文件夹
// const externalRouteFiles = import.meta.glob('./external/**/*.ts', { eager: true });
// const staticRouteFiles = import.meta.glob('./static/**/*.ts', { eager: true });

/** 外部路由列表，访问这些页面可以不需要Layout，可能用于内嵌在别的系统(不会显示在菜单中) */
// const externalRoutes: RouteRecordRaw[] = mergeRouteModules(externalRouteFiles);
// const staticRoutes: RouteRecordRaw[] = mergeRouteModules(staticRouteFiles);
const staticRoutes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:copyright',
      title: 'page.about.title',
      order: 9999,
    },
    name: 'About',
    path: '/about',
    component: () => import('@/views/about/index.vue'),
  },
]
const externalRoutes: RouteRecordRaw[] = []
/** 基本路由，这些路由是必须存在的 */
const coreRoutes: RouteRecordRaw[] = [
  /**
   * 根路由
   * 使用基础布局，作为所有页面的父级容器，子级就不必配置BasicLayout。
   * 此路由必须存在，且不应修改
   */
  {
    component: BasicLayout,
    meta: {
      hideInBreadcrumb: true,
      title: 'Root',
    },
    name: 'Root',
    path: '/',
    redirect: '/dashboard',
    children: [],
  },
  {
    component: AuthPageLayout,
    meta: {
      hideInTab: true,
      title: 'Authentication',
    },
    name: 'Authentication',
    path: '/auth',
    redirect: LOGIN_PATH,
    children: [
      {
        name: 'Login',
        path: LOGIN_PATH,
        component: () => import('@/views/authentication/login/index.vue'),
        meta: {
          title: 'page.auth.login',
        },
      },
      {
        name: 'CodeLogin',
        path: 'code-login',
        component: () => import('@/views/authentication/code-login/index.vue'),
        meta: {
          title: 'page.auth.codeLogin',
        },
      },
      {
        name: 'QrCodeLogin',
        path: 'qrcode-login',
        component: () => import('@/views/authentication/qrcode-login/index.vue'),
        meta: {
          title: 'page.auth.qrcodeLogin',
        },
      },
      {
        name: 'ForgetPassword',
        path: 'forget-password',
        component: () => import('@/views/authentication/forget-password/index.vue'),
        meta: {
          title: 'page.auth.forgetPassword',
        },
      },
      {
        name: 'Register',
        path: 'register',
        component: () => import('@/views/authentication/register/index.vue'),
        meta: {
          title: 'page.auth.register',
        },
      },
    ],
  },
]

/** 全局404页面 */
const fallbackNotFoundRoute: RouteRecordRaw = {
  component: () => import('@/views/fallback/not-found.vue'),
  meta: {
    hideInBreadcrumb: true,
    hideInMenu: true,
    hideInTab: true,
    title: '404',
  },
  name: 'FallbackNotFound',
  path: '/:path(.*)*',
}

/** 有权限校验的路由列表，包含动态路由和静态路由 */
const accessRoutes = [...dynamicRoutes, ...staticRoutes]

/** 路由列表，由基本路由、外部路由和404兜底路由组成
 *  无需走权限验证（会一直显示在菜单中） */
const routes: RouteRecordRaw[] = [...coreRoutes, ...externalRoutes, fallbackNotFoundRoute]

/** 基本路由列表，这些路由不需要进入权限拦截 */
const coreRouteNames = traverseTreeValues(coreRoutes, (route) => route.name)

export { routes, coreRouteNames, fallbackNotFoundRoute, accessRoutes }
