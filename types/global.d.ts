/*
 * @Author: shen
 * @Date: 2025-05-27 13:21:09
 * @LastEditors: shen
 * @LastEditTime: 2025-08-21 14:52:24
 * @Description:
 */
import type { RouteMeta as IRouteMeta } from './vue-router'

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta extends IRouteMeta {}
}

export interface ApplicationConfig {
  apiURL: string
}

declare global {
  interface Window {
    rawWindow: Window
    rawDocument: Document
    mount: (...args: any) => void
    unmount: (...args: any) => void
    microApp: any
    __MAIM_APP_ENV__: boolean
    __MICRO_APP_ENVIRONMENT__: boolean
    __MICRO_APP_PUBLIC_PATH__: string
    __MICRO_APP_BASE_ROUTE__: string
    __MICRO_APP_NAME__: string
    __MICRO_APP_BASE_APPLICATION__: boolean
    __PRO_ADMIN_METADATA__: {
      authorEmail: string
      authorName: string
      authorUrl: string
      buildTime: string
      dependencies: Record<string, string>
      description: string
      devDependencies: Record<string, string>
      homepage: string
      license: string
      repositoryUrl: string
      version: string
    }
  }
}
