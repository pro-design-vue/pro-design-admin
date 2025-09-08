/*
 * @Author: shen
 * @Date: 2025-05-26 13:45:12
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 15:46:05
 * @Description:
 */
import { createApp, watch, watchEffect } from 'vue'
import { $t, setupI18n } from './locales'
// import { setupMockData } from './mock'
import { useTitle } from '@vueuse/core'
import { preferences, initPreferences } from './shared/preferences'
import { setupStore } from './stores'
import { VITE_APP_NAME, VITE_LOGGER_LEVEL, VITE_REQUEST_MOCK } from './shared/constants'
import { overridesPreferences } from './preferences'
import logger, { setupLogger } from './shared/logger'
import router, { setupRouter } from './router'
import config from './config'
import microApp from '@micro-zoe/micro-app'
import App from './App.vue'
import 'pro-design-vue/theme-chalk/src/index.less'
import './styles'

async function bootstrap(namespace: string) {
  //环境变量
  // app偏好设置初始化
  await initPreferences({
    overrides: overridesPreferences,
  })

  const app = createApp(App)
  // 是否启用mock数据
  if (VITE_REQUEST_MOCK) {
    const { setupMockData } = await import('./mock')
    setupMockData()
  }
  microApp.start({
    tagName: !config.powerByMicro
      ? 'micro-app'
      : `micro-app-${config.baseRoute.slice(1).toLowerCase()}`,
    'disable-memory-router': true, // 关闭虚拟路由系统
    'disable-patch-request': true, // 关闭对子应用请求的拦截
    'router-mode': 'native', // 开启路由隔离
    iframeSrc: `${window.origin}/empty.html`,
    fetch: (url, options) => {
      const config: Record<string, unknown> = {
        // credentials: 'include', // 请求时带上cookie
      }
      return window.fetch(url, Object.assign({}, options, config)).then((res) => res.text())
    },
  })

  setupLogger(app, {
    level: VITE_LOGGER_LEVEL,
    name: VITE_APP_NAME,
  })
  // 国际化 i18n 配置
  await setupI18n(app)
  // 配置store
  setupStore(app)
  // 配置路由及路由守卫
  setupRouter(app)
  app.mount('#app')
  // 输出当前命名空间
  logger.info('namespace', namespace)

  // 动态更新标题
  watchEffect(() => {
    if (preferences.app.dynamicTitle) {
      const routeTitle = router.currentRoute.value.meta?.title
      const pageTitle = (routeTitle ? `${$t(routeTitle)} - ` : '') + preferences.app.name
      useTitle(pageTitle)
    }
  })

  // watch(
  //   () => preferences.app,
  //   (newVal) => {
  //     if (newVal.locale !== preferences.app.locale) {
  //     }
  //     microApp.setGlobalData({
  //       locale: newVal.locale,
  //     })
  //   },
  // )

  watch(
    () => preferences.theme,
    (newVal) => {
      microApp.setGlobalData({
        theme: newVal,
      })
    },
  )
}

export { bootstrap }
