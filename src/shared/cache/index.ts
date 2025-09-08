/*
 * @Author: shen
 * @Date: 2025-05-29 11:07:16
 * @LastEditors: shen
 * @LastEditTime: 2025-06-30 15:33:41
 * @Description:
 */
import { VITE_APP_STORAGE_SECURE_KEY } from '../constants'
import { createNamespace } from '../utils'
import { StorageManager } from './storage-manager'
export * from './storage-manager'

const namespace = createNamespace()
StorageManager.setGlobalPrefix(namespace)
StorageManager.setGlobalEncryptionSecret(VITE_APP_STORAGE_SECURE_KEY)

const localCache = new StorageManager()
const sessionCache = new StorageManager({
  storageType: 'sessionStorage',
})

export { localCache, sessionCache }
