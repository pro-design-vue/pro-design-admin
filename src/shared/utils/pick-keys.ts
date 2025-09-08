/*
 * @Author: shen
 * @Date: 2022-11-03 18:04:01
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 11:49:40
 * @Description:
 */
export function pickKeys<T extends Record<string, any>>(obj: T, keys: string[]): T {
  const newObj = {} as any
  if (Array.isArray(keys) && keys.length > 0) {
    Object.keys(obj || {}).forEach((key: string) => {
      if (keys.includes(key)) {
        newObj[key] = obj[key]
      }
    })
  }

  return newObj as T
}

export default pickKeys
