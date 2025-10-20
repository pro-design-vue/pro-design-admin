/*
 * @Author: shen
 * @Date: 2023-10-26 14:03:01
 * @LastEditors: shen
 * @LastEditTime: 2025-10-20 14:52:23
 * @Description:
 */
declare interface AppConfig {
  title?: string
  lang?: LocaleType
  baseApi?: string
  baseWs?: string
  timeout?: number
  themeColor?: string
  namespace?: string
  encrype?: boolean
  colorWeak?: boolean
  grayMode?: boolean
  darkMode?: boolean
  enableSetting?: boolean
  size?: SizeType
  isMock?: boolean
  isStorageEncrype?: boolean
  microApp?: boolean
}
