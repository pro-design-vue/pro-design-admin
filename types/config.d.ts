/*
 * @Author: shen
 * @Date: 2023-10-26 14:03:01
 * @LastEditors: shen
 * @LastEditTime: 2025-05-30 17:12:21
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
  accessMode?: AccessModeType
  microApp?: boolean
}
