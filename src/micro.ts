/*
 * @Author: shen
 * @Date: 2025-05-26 13:45:12
 * @LastEditors: shen
 * @LastEditTime: 2025-09-08 16:08:36
 * @Description:
 */
import type { App as AppInstance } from 'vue'
import type { Pinia } from 'pinia'
import type { ComponentRecordType } from './typings'
import type { Router, RouteRecordRaw, RouterHistory } from 'vue-router'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { setupI18n } from './locales'
import { updatePreferences, preferences } from './shared/preferences'
import { VITE_APP_NAME, VITE_LOGGER_LEVEL, VITE_ROUTER_HISTORY } from './shared/constants'
import { setupLogger } from './shared/logger'
import { accessRoutes, fallbackNotFoundRoute } from './router/routes'
import { useAuthStore } from '@/stores'
import { isEqual } from './shared/utils'
import config from './config'
import App from './App.vue'
import './styles'

let app: AppInstance | null = null
let router: Router | null = null
let history: RouterHistory | null = null
let store: Pinia | null = null

const createHistory = () => {
  return VITE_ROUTER_HISTORY === 'hash'
    ? createWebHashHistory(window.__MICRO_APP_BASE_ROUTE__)
    : createWebHistory(window.__MICRO_APP_BASE_ROUTE__)
}

async function createRoute(props: Record<string, any>): Promise<RouteRecordRaw> {
  const componentPath = props.route.meta?.componentPath
  // 服务端返回路由组件路径
  if (componentPath) {
    const pageMap: ComponentRecordType = import.meta.glob([
      './views/**/*.vue',
      '!./views/**/components/**/*.vue',
    ])
    const component = pageMap[`./views${componentPath}.vue`]
    if (!!component) {
      return {
        ...props.route,
        component,
        path: props.path,
      } as RouteRecordRaw
    }
    return {
      ...fallbackNotFoundRoute,
      path: props.path,
    } as RouteRecordRaw
  }

  // 查找本地路由组件
  const findRoute = (array) => {
    for (const item of array) {
      if (item.path === props.path) {
        return item
      } else if (item.children?.length) {
        const route = findRoute(item.children)
        if (route) {
          return route
        }
      }
    }
    return null
  }

  const route = findRoute(accessRoutes)
  return {
    ...(route ? route : fallbackNotFoundRoute),
    path: props.path,
  } as RouteRecordRaw
}

async function createRouterGuard(router: Router, props: Record<string, any>) {
  router.beforeEach(async (to) => {
    if (to.path === props.path) {
      return true
    } else {
      if (to.path === '/') {
        props.router.push(to.path)
      } else {
        props.router.push(`${props.baseroute}${to.path}`)
      }
      return false
    }
  })
}

function initAuthstore(props: Record<string, any>) {
  const { accessToken, userInfo } = props
  const authStore = useAuthStore()
  authStore.setAccessToken(accessToken)
  authStore.setUserInfo(userInfo)
}

// function handleGlobalDataListener(data: Record<string, any>) {
//   // const { theme } = data
//   // if (!isEqual(theme, preferences.theme)) {
//   //   updatePreferences({ theme })
//   // }
// }

function handleDataListener(data: Record<string, any>) {
  const { theme } = data
  if (!isEqual(theme, preferences.theme)) {
    updatePreferences({ theme })
  }
  if (data.actived !== preferences.micro.actived) {
    updatePreferences({
      micro: {
        actived: data.actived,
      },
    })
  }
}

async function bootstrap(props: Record<string, any>) {
  console.log('🚀 ~ bootstrap ~ props:', props)
  const route = await createRoute(props)
  history = createHistory()
  router = createRouter({
    history,
    routes: [route, fallbackNotFoundRoute],
  })
  router.listening = false
  store = createPinia()
  app = createApp(App, {
    contentOffsetTop: props.contentOffsetTop,
  })
  app?.use(router)
  app?.use(store)
  app?.provide('app', props)
  initAuthstore(props)
  createRouterGuard(router, props)
  setupLogger(app, {
    level: VITE_LOGGER_LEVEL,
    name: VITE_APP_NAME,
  })
  // 国际化 i18n 配置
  await setupI18n(app)
  app?.mount('#app')
  window.microApp.addDataListener(handleDataListener)
  // window.microApp.addGlobalDataListener(handleGlobalDataListener)
}

async function mount(props) {
  console.log(`[${config.microName}] micro app mounted`)
  bootstrap(props)
}

async function unmount() {
  console.log(`[${config.microName}] micro app unmounted`)
  app?.unmount()
  history?.destroy()
  app = null
  router = null
  store = null
  history = null
  window.microApp.clearDataListener()
  window.microApp.clearGlobalDataListener()
  window.microApp.clearGlobalData()
}

export { mount, unmount, bootstrap }
