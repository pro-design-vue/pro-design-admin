import { aesDecrypt, aesEncrypt } from '../utils'
import { compressToUTF16, decompressFromUTF16 } from 'lz-string/libs/lz-string'
import logger from '../logger'
import Base64 from './Base64'
export type StorageType = 'localStorage' | 'sessionStorage'

export interface StorageManagerOptions {
  prefix?: string
  storageType?: StorageType
  isEncrypt?: boolean
  encryptionSecret?: string
  metaKey?: string
}

interface StorageItem<T> {
  expiry?: number
  timestamp?: number
  value: T
}

class StorageManager {
  static prefix?: string
  static isEncrypt?: boolean
  static encryptionSecret?: string
  private _prefix?: string
  private _isEncrypt?: boolean
  private _encryptionSecret?: string
  private storage?: Storage
  private metaKey?: string
  private encryptKeys = new Set<string>()
  private LZString = { compressToUTF16, decompressFromUTF16 }

  static setGlobalPrefix(value?: string) {
    this.prefix = value
  }

  static setGlobalIsEncrypt(value?: boolean) {
    this.isEncrypt = value
  }

  static setGlobalEncryptionSecret(value?: string) {
    this.encryptionSecret = value
  }
  constructor({
    prefix = '',
    storageType = 'localStorage',
    isEncrypt = false,
    metaKey = '_storage__metadata',
    encryptionSecret,
  }: StorageManagerOptions = {}) {
    this._prefix = prefix
    this._isEncrypt = isEncrypt
    this._encryptionSecret = encryptionSecret
    this.metaKey = metaKey
    this.storage = storageType === 'localStorage' ? window.localStorage : window.sessionStorage
    const metaData = this.getMetaData()
    this.encryptKeys = new Set(metaData.encryptKeys ?? [])
  }

  get prefix() {
    return this._prefix || StorageManager.prefix
  }

  get isEncrypt() {
    return this._isEncrypt || StorageManager.isEncrypt
  }

  get encryptionSecret() {
    return this._encryptionSecret || StorageManager.encryptionSecret
  }

  getMetaData(): Record<string, any> {
    return this.getItem(this.getMetaKey(), null, true) || {}
  }

  getMetaKey() {
    return this.metaKey!
  }

  setMetaData() {
    this.setItem(
      this.getMetaKey(),
      {
        encryptKeys: Array.from(this.encryptKeys),
      },
      0,
      true,
    )
  }

  /**
   * 清除所有带前缀的存储项
   */
  clear(): void {
    const keysToRemove: string[] = []
    for (let i = 0; i < this.storage!.length; i++) {
      const key = this.storage!.key(i)
      if (key && key.startsWith(this.prefix!)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => this.storage!.removeItem(key))
  }

  /**
   * 清除所有过期的存储项
   */
  clearExpiredItems(): void {
    for (let i = 0; i < this.storage!.length; i++) {
      const key = this.storage!.key(i)
      if (key && key.startsWith(this.prefix!)) {
        const shortKey = key.replace(this.prefix!, '')
        this.getItem(shortKey) // 调用 getItem 方法检查并移除过期项
      }
    }
  }

  /**
   * 获取存储项
   * @param key 键
   * @param defaultValue 当项不存在或已过期时返回的默认值
   * @returns 值，如果项已过期或解析错误则返回默认值
   */
  getItem<T = any>(
    key: string,
    defaultValue: null | T = null,
    isEncrypt: boolean = false,
  ): null | T {
    const fullKey = this.getFullKey(key)
    let itemStr = this.storage!.getItem(fullKey)
    if (!itemStr) {
      return defaultValue
    }
    const hasEncrypt = isEncrypt || this.encryptKeys.has(fullKey)
    if (hasEncrypt) {
      itemStr = this.LZString.decompressFromUTF16(itemStr)
      itemStr = aesDecrypt(itemStr, this.encryptionSecret || '')
      itemStr = Base64.decode(itemStr)
    }
    try {
      const item: StorageItem<T> = JSON.parse(itemStr!)
      if (!item || (item.expiry && Date.now() > item.expiry)) {
        this.storage!.removeItem(fullKey)
        return defaultValue
      }
      return item.value
    } catch (error) {
      logger.error(`Error parsing item with key "${fullKey}":`, error)
      // 如果解析失败，删除该项
      this.storage!.removeItem(fullKey)
      return defaultValue
    }
  }

  /**
   * 移除存储项
   * @param key 键
   */
  removeItem(key: string): void {
    const fullKey = this.getFullKey(key)
    this.encryptKeys.delete(fullKey)
    this.storage!.removeItem(fullKey)
  }

  /**
   * 设置存储项
   * @param key 键
   * @param value 值
   * @param ttl 存活时间（毫秒）
   * @param isEncrypt 是否加密
   */
  setItem<T = any>(key: string, value: T, ttl?: number, isEncrypt?: boolean): void {
    const fullKey = this.getFullKey(key)
    const expiry = ttl ? Date.now() + ttl : undefined
    const item: StorageItem<T> = { expiry, value, timestamp: Date.now() }
    try {
      let data = JSON.stringify(item)
      const hasEncrypt = isEncrypt ?? this.isEncrypt ?? StorageManager.isEncrypt
      if (hasEncrypt) {
        data = Base64.encode(data)
        data = aesEncrypt(data, this.encryptionSecret || '')
        data = this.LZString.compressToUTF16(data)
        this.encryptKeys.add(fullKey)
        if (!(String(key) === String(this.metaKey))) {
          this.setMetaData()
        }
      }
      this.storage!.setItem(fullKey, data)
    } catch (error) {
      logger.error(`Error setting item with key "${fullKey}":`, error)
    }
  }

  /**
   * 获取完整的存储键
   * @param key 原始键
   * @returns 带前缀的完整键
   */
  private getFullKey(key: string): string {
    if (this.prefix) {
      return `${this.prefix}-${key}`
    }
    return key
  }
}

export { StorageManager }
