/*
 * @Author: shen
 * @Date: 2025-05-27 09:19:05
 * @LastEditors: shen
 * @LastEditTime: 2025-08-19 10:42:40
 * @Description:
 */
import { traverseTreeValues } from '@/shared/utils'
import type { RouteRecordName, RouteRecordRaw, Router } from 'vue-router'

// 定义模块类型
interface RouteModuleType {
  default: RouteRecordRaw[]
}

/**
 * 合并动态路由模块的默认导出
 * @param routeModules 动态导入的路由模块对象
 * @returns 合并后的路由配置数组
 */
function mergeRouteModules(routeModules: Record<string, unknown>): RouteRecordRaw[] {
  const mergedRoutes: RouteRecordRaw[] = []

  for (const routeModule of Object.values(routeModules)) {
    const moduleRoutes = (routeModule as RouteModuleType)?.default ?? []
    mergedRoutes.push(...moduleRoutes)
  }

  return mergedRoutes
}

function resetStaticRoutes(router: Router, routes: RouteRecordRaw[]) {
  // 获取静态路由所有节点包含子节点的 name，并排除不存在 name 字段的路由
  const staticRouteNames = traverseTreeValues<RouteRecordRaw, RouteRecordName | undefined>(
    routes,
    (route) => {
      // 这些路由需要指定 name，防止在路由重置时，不能删除没有指定 name 的路由
      if (!route.name) {
        console.warn(
          `The route with the path ${route.path} needs to have the field name specified.`,
        )
      }
      return route.name
    },
  )

  const { getRoutes, hasRoute, removeRoute } = router
  const allRoutes = getRoutes()
  allRoutes.forEach(({ name }) => {
    // 存在于路由表且非白名单才需要删除
    if (name && !staticRouteNames.includes(name) && hasRoute(name)) {
      removeRoute(name)
    }
  })
}

function normalizeViewPath(path: string): string {
  // 去除相对路径前缀
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '')

  // 确保路径以 '/' 开头
  const viewPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`

  return viewPath.replace(/^\/views/, '')
}

export { mergeRouteModules, resetStaticRoutes, normalizeViewPath }

export type { RouteModuleType }
