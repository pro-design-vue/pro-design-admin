/*
 * @Author: shen
 * @Date: 2025-05-12 10:43:02
 * @LastEditors: shen
 * @LastEditTime: 2025-08-25 17:18:46
 * @Description:
 */
import { unmountGlobalLoading, createNamespace } from './shared/utils'
import { initPreferences } from './shared/preferences'
import { overridesPreferences } from './preferences'
import config from './config'
/**
 * 应用初始化完成之后再进行页面加载渲染
 */
async function initApplication() {
  const namespace = createNamespace()
  // app偏好设置初始化
  await initPreferences({
    overrides: overridesPreferences,
  })
  // 启动应用并挂载
  // vue应用主要逻辑及视图
  const { bootstrap } = await import('./bootstrap')
  await bootstrap(namespace)
  unmountGlobalLoading()
}

let unmountMicro: any
async function initialMicro(props: Record<string, any>) {
  unmountGlobalLoading()
  // app偏好设置初始化
  // 微前端环境下，不使用本地缓存，使用主应用配置
  await initPreferences({
    useCache: false,
    overrides: {
      ...props.preferences,
      micro: {
        url: props.url,
        baseroute: props.baseroute,
        name: props.microName,
        appName: props.appName,
        path: props.path,
        tabName: props.tabName,
        actived: true,
      },
    },
  })
  // 启动微前端应用并挂载
  // umd模式渲染微前端
  const { bootstrap, unmount } = await import('./micro')
  unmountMicro = unmount
  bootstrap(props)
}

function mount(props: Record<string, any>) {
  console.log(`[${config.microName}] micro app mounted`)
  initialMicro(props)
}

function unmount() {
  unmountMicro?.()
}

if (config.isMainApp) {
  initApplication()
} else {
  Object.assign(window, { mount, unmount })
}
