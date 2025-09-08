/*
 * @Author: shen
 * @Date: 2025-08-14 09:08:57
 * @LastEditors: shen
 * @LastEditTime: 2025-08-22 10:47:26
 * @Description:
 */
import {
  DEFAULT_NAMESPACE,
  VITE_APP_NAME,
  VITE_PUBLIC_PATH,
  VITE_APP_NAMESPACE,
  VITE_APP_ANTD_PREFIX_CLS,
  VITE_API_URL_PREFIX,
} from '@/shared/constants'

interface Config {
  isProd: boolean
  isMainApp: boolean
  microName: string
  powerByMicro: boolean
  baseRoute: string
  prefixCls: string
  antdPrefixCls: string
  apiUrlPrefix: string
}

const config: Config = {
  isProd: import.meta.env.MODE === 'production',
  isMainApp: !window.__MICRO_APP_ENVIRONMENT__, // 是否是主应用，独立访问时都是主应用
  microName: window.__MICRO_APP_NAME__ || VITE_APP_NAME, // 微应用名
  powerByMicro: window.__MICRO_APP_ENVIRONMENT__, // 是否微应用运行时
  baseRoute: window.__MICRO_APP_BASE_ROUTE__ || VITE_PUBLIC_PATH, // 路由基础路径
  prefixCls: VITE_APP_NAMESPACE || DEFAULT_NAMESPACE,
  antdPrefixCls: VITE_APP_ANTD_PREFIX_CLS,
  apiUrlPrefix: VITE_API_URL_PREFIX,
}

export default config
