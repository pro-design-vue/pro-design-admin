/*
 * @Author: shen
 * @Date: 2025-05-27 13:31:29
 * @LastEditors: shen
 * @LastEditTime: 2025-10-16 20:10:09
 * @Description:
 */
import type { ComponentRecordType, MenuData } from '@/typings'
import type { Router, RouteRecordRaw } from 'vue-router'
import type { Component, DefineComponent } from 'vue'
import { defineComponent, h } from 'vue'
import { BasicLayout } from '@/layouts'
import { normalizeViewPath } from './utils'
import { forTree, omit, pick } from '@/shared/utils'
import {
  isFunction,
  isString,
  mapTree,
  omitUndefined,
  toTree,
  cloneDeep,
  isHttpUrl,
} from '@/shared/utils'
import logger from '@/shared/logger'

interface GenerateMenuAndRoutesOptions {
  layoutMap?: ComponentRecordType
  pageMap?: ComponentRecordType
  router: Router
  routes: RouteRecordRaw[]
  menus: MenuData[]
}

const ROUTE_META_KEYS = [
  'activeIcon',
  'activePath',
  'affixTab',
  'affixTabOrder',
  'hideChildrenInMenu',
  'hideInBreadcrumb',
  'hideInMenu',
  'hideInTab',
  'icon',
  'iframeSrc',
  'microUrl',
  'componentPath',
  'appName',
  'ignoreAccess',
  'keepAlive',
  'link',
  'loaded',
  'maxNumOfOpenTab',
  'menuVisibleWithForbidden',
  'noBasicLayout',
  'openInNewWindow',
  'order',
  'query',
  'title',
]

function convertRoutes(
  menusTree: Record<string, any>[],
  localeRouteMap: Record<string, RouteRecordRaw>,
  layoutMap: ComponentRecordType,
  pageMap: ComponentRecordType,
): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []
  mapTree(menusTree, (node) => {
    const route = node as unknown as any
    const localeRoute = localeRouteMap[route.path]
    const { component, name, microUrl, iframeSrc } = node
    if (!name) {
      console.error('route name is required', route)
    }
    if (!(iframeSrc || microUrl)) {
      // layout转换
      if (component && layoutMap[component]) {
        route.component = layoutMap[component]
        // 页面组件转换
      } else if (component) {
        const normalizePath = normalizeViewPath(component)
        const pageKey = normalizePath.endsWith('.vue') ? normalizePath : `${normalizePath}.vue`
        if (pageMap[pageKey]) {
          route.component = pageMap[pageKey]
        } else {
          logger.error(`route component is invalid: ${pageKey}`, route)
          route.component = pageMap['/fallback/not-found.vue']
        }
      } else {
        const childrenLength = route.children?.filter((item) => !item?.hideInMenu).length
        if (!childrenLength && !isHttpUrl(route.path)) {
          if (localeRoute?.component) {
            route.component = localeRoute?.component
          } else {
            logger.error(`the routing configuration does not exist`, route)
            // route.component = pageMap['/fallback/not-found.vue']
          }
        }
      }
    } else {
      if (route.microUrl) {
        route.path = `/${route.appName}${route.path}`
        route.redirect = route.redirect ? `/${route.appName}${route.redirect}` : undefined
        route.meta = {
          componentPath: route.component,
        }
      }
      if (!route.children?.length) {
        route.component = async () => {
          return defineComponent({
            name: route.name as string,
            setup() {
              let url = microUrl
              if (url && microUrl.endsWith('/')) {
                url = url.slice(0, -1)
              }
              return () =>
                h('div', url ? `MicroAppPage:${url}${route.path}` : `IframePage:${iframeSrc}`)
            },
          })
        }
      }
    }

    const resultChildren = node.hideChildrenInMenu ? [] : (node.children ?? [])
    const metaData = pick(route, ROUTE_META_KEYS)
    const meta = omitUndefined({
      ...(localeRoute?.meta ?? {}),
      ...(route.meta ?? {}),
      ...metaData,
    })
    if (resultChildren.length > 0) {
      resultChildren.forEach((child) => {
        const copyNode = {
          name: node.name,
          path: node.path,
          meta,
        }
        child.parents = [...(node.parents ?? []), copyNode]
        child.parent = copyNode
      })
    }

    //根据menu数据重新包装route meta数据
    route.meta = omitUndefined({
      ...meta,
      parent: node.parent,
      parents: node.parents,
    })
    route.redirect = route.redirect || localeRoute?.redirect

    const newRoute = pick(route, [
      'component',
      'children',
      'redirect',
      'props',
      'path',
      'alias',
      'name',
      'meta',
    ]) as unknown as RouteRecordRaw
    if (newRoute.component) {
      routes.push(omit(newRoute, ['children']) as RouteRecordRaw)
    }
    return newRoute
  })
  return routes
}

function generateLocaleRouteMap(routes: RouteRecordRaw[]) {
  const routeMap: Record<string, RouteRecordRaw> = {}
  forTree(routes, (node) => {
    routeMap[node.path] = node
  })
  return routeMap
}

async function generateRoutesByBackend(
  options: GenerateMenuAndRoutesOptions,
): Promise<RouteRecordRaw[]> {
  const { menus = [], layoutMap = {}, pageMap = {}, routes = [] } = options
  const menusTree = toTree(menus)
  try {
    if (!menus?.length) {
      return []
    }
    const normalizePageMap: ComponentRecordType = {}
    for (const [key, value] of Object.entries(pageMap)) {
      normalizePageMap[normalizeViewPath(key)] = value
    }
    const localeRouteMap = generateLocaleRouteMap(routes)
    const formatRoutes = convertRoutes(menusTree, localeRouteMap, layoutMap, normalizePageMap)
    return formatRoutes
  } catch (error) {
    console.error(error)
    throw error
  }
}

const generateRoutes = async (options: GenerateMenuAndRoutesOptions) => {
  let resultRoutes: RouteRecordRaw[] = await generateRoutesByBackend(options)
  /**
   * 调整路由树，做以下处理：
   * 1. 对未添加redirect的路由添加redirect
   * 2. 将懒加载的组件名称修改为当前路由的名称（如果启用了keep-alive的话）
   */
  resultRoutes = mapTree(resultRoutes, (route) => {
    // 重新包装component，使用与路由名称相同的name以支持keep-alive的条件缓存。
    if (
      route.meta?.keepAlive &&
      isFunction(route.component) &&
      route.name &&
      isString(route.name)
    ) {
      const originalComponent = route.component as () => Promise<{
        default: Component | DefineComponent
      }>
      route.component = async () => {
        const component = await originalComponent()
        if (!component.default) return component
        return defineComponent({
          name: route.name as string,
          setup(props, { attrs, slots }) {
            return () => h(component.default, { ...props, ...attrs }, slots)
          },
        })
      }
    }

    // 如果有redirect或者没有子路由，则直接返回
    const children = route.children?.filter((item) => !item.meta?.hideInMenu)
    if (route.redirect || !children || children.length === 0) {
      return route
    }
    const firstChild = route.children?.[0]

    // 如果子路由不是以/开头，则直接返回,这种情况需要计算全部父级的path才能得出正确的path，这里不做处理
    if (!firstChild?.path || !firstChild.path.startsWith('/')) {
      return route
    }

    route.redirect = firstChild.path
    return route
  })

  return resultRoutes
}

const generateAccessible = async (options: GenerateMenuAndRoutesOptions) => {
  const { router } = options
  options.routes = cloneDeep(options.routes)

  const accessibleRoutes = await generateRoutes(options)
  const root = router.getRoutes().find((item) => item.path === '/')

  // 获取已有的路由名称列表
  const names = root?.children?.map((item) => item.name) ?? []

  // 动态添加到router实例内
  accessibleRoutes.forEach((route) => {
    if (root && !route.meta?.noBasicLayout) {
      // 根据router name判断，如果路由已经存在，则不再添加
      if (names?.includes(route.name)) {
        // 找到已存在的路由索引并更新，不更新会造成切换用户时，一级目录未更新，homePath 在二级目录导致的404问题
        const index = root.children?.findIndex((item) => item.name === route.name)
        if (index !== undefined && index !== -1 && root.children) {
          root.children[index] = route
        }
      } else {
        root.children?.push(route)
      }
    } else {
      router.addRoute(route)
    }
  })

  if (root) {
    if (root.name) {
      router.removeRoute(root.name)
    }
    router.addRoute(root)
  }
}

const generateAccess = async (options: GenerateMenuAndRoutesOptions) => {
  const pageMap: ComponentRecordType = import.meta.glob([
    '../views/**/*.vue',
    '!../views/**/components/**/*.vue',
  ])

  const layoutMap: ComponentRecordType = {
    BasicLayout,
  }

  return await generateAccessible({
    ...options,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  })
}

export { generateAccess }
