/*
 * @Author: shen
 * @Date: 2025-06-03 14:27:11
 * @LastEditors: shen
 * @LastEditTime: 2025-06-03 14:27:25
 * @Description:
 */
function omitUndefined<T extends Record<string, any>>(obj: T): T {
  const newObj = {} as any
  Object.keys(obj || {}).forEach((key: string) => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key]
    }
  })
  if (Object.keys(newObj).length < 1) {
    return undefined as any
  }
  return newObj as T
}

function omitKeysAndUndefined<T extends Record<string, any>>(obj: T, keys: string[]): T {
  const newObj = {} as any
  Object.keys(obj || {}).forEach((key: string) => {
    if (!keys.includes(key) && obj[key] !== undefined) {
      newObj[key] = obj[key]
    }
  })
  if (Object.keys(newObj).length < 1) {
    return undefined as any
  }
  return newObj as T
}

function omit<T extends object, K extends keyof T>(obj: T, fields: K[]): Omit<T, K> {
  const shallowCopy = Object.assign({}, obj)
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i]
    delete shallowCopy[key]
  }
  return shallowCopy
}

export { omit, omitUndefined, omitKeysAndUndefined }
