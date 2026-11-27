/*
 * 微应用预加载：菜单生成后利用 micro-app 的空闲预加载能力提前缓存子应用资源。
 * 仅在主应用模式生效；预加载在浏览器空闲时执行，不影响当前页面交互。
 */
import microApp from '@micro-zoe/micro-app'
import type { MenuData } from '@/typings'
import config from '@/config'

const MAX_PREFETCH_COUNT = 5

export function prefetchMicroApps(menus: MenuData[]) {
  if (!config.isMainApp || !menus?.length) {
    return
  }

  const apps: { name: string; url: string; iframe: boolean }[] = []
  const urls = new Set<string>()

  for (const menu of menus) {
    const url = menu?.microUrl as string | undefined
    if (!url || urls.has(url)) {
      continue
    }
    urls.add(url)
    apps.push({
      name: String(menu.appName ?? menu.name ?? 'micro-app'),
      url,
      iframe: true,
    })
    if (apps.length >= MAX_PREFETCH_COUNT) {
      break
    }
  }

  if (apps.length) {
    microApp.preFetch(apps)
  }
}
