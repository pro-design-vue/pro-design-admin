/*
 * @Author: shen
 * @Date: 2023-05-23 22:06:56
 * @LastEditors: shen
 * @LastEditTime: 2025-08-23 13:23:02
 * @Description:
 */
declare type Writable<T> = {
  -readonly [P in keyof T]: T[P]
}

declare interface VoidFunction {
  (): void
}

declare type Nullable<T> = T | null
declare type Recordable<T = any> = Record<string, T>
declare type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T
}
declare type Indexable<T = any> = {
  [key: string]: T
}
declare type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}
declare type TimeoutHandle = ReturnType<typeof setTimeout>
declare type IntervalHandle = ReturnType<typeof setInterval>

declare type WithFalse<T> = T | false

declare type Arrayable<T> = T | T[]

declare interface ChangeEvent extends Event {
  target: HTMLInputElement
}

declare interface WheelEvent {
  path?: EventTarget[]
}
declare interface ImportMetaEnv extends ViteEnv {
  __: unknown
}

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

declare type RefType<T> = T | null

interface Window {
  APP_DEFAULT_SETTING: Record<string, any>
}

declare interface ViteEnv {
  VITE_PORT: number
  VITE_APP_NAME: string
  VITE_USE_MOCK: boolean
  VITE_PUBLIC_PATH: string
  VITE_PROXY: [string, string][]
  VITE_APP_TITLE: string
  VITE_DROP_CONSOLE: boolean
  VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
  VITE_LEGACY: boolean
  VITE_ENCRYPE: boolean
  VITE_USE_IMAGEMIN: boolean
  VITE_APP_THEME_COLOR: string
  VITE_APP_SUCCESS_COLOR: string
  VITE_APP_ERROR_COLOR: string
  VITE_APP_WARNING_COLOR: string
  VITE_APP_INFO_COLOR: string
  VITE_APP_LANGUAGE: any
  VITE_API_URL_PREFIX: string
  VITE_WS_URL_PREFIX: string
  VITE_UPLOAD_URL_PREFIX: string
  VITE_APP_COLOR_WEAK: boolean
  VITE_APP_GRAY_MODE: boolean
  VITE_APP_NAMESPACE: string
  VITE_APP_ANTD_PREFIX_CLS: string
  VITE_APP_DARK_MODE: boolean
  VITE_ENABLE_SETTING: boolean
  VITE_VISUALIZER: boolean
  VITE_ARCHIVER: boolean
  VITE_PWA: boolean
  VITE_REQUEST_MOCK: boolean
  VITE_APP_VERSION: string
  VITE_APP_STORAGE_SECURE_KEY: string
  VITE_APP_STORAGE_ENCRYPE: boolean
  VITE_ROUTER_HISTORY?: string
  VITE_MAIN_APP?: boolean
  VITE_LOGGER_LEVEL: 'debug' | 'verbose' | 'info' | 'warn' | 'error' | 'silent'
}
