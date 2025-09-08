/*
 * @Author: shen
 * @Date: 2025-05-30 15:13:26
 * @LastEditors: shen
 * @LastEditTime: 2025-06-30 15:34:29
 * @Description:
 */
import { VITE_APP_NAMESPACE, VITE_APP_VERSION } from '../constants'

function createNamespace() {
  // name用于指定项目唯一标识
  // 用于区分不同项目的偏好设置以及存储数据的key前缀以及其他一些需要隔离的数据
  const env = import.meta.env.PROD ? 'prod' : 'dev'
  const appVersion = VITE_APP_VERSION
  const namespace = `${VITE_APP_NAMESPACE}-${appVersion}-${env}`

  return namespace
}

export { createNamespace }
