/*
 * @Author: shen
 * @Date: 2023-08-09 11:24:16
 * @LastEditors: shen
 * @LastEditTime: 2023-08-09 11:24:23
 * @Description:
 */
export function runFunction<T extends any[]>(valueEnum: any, ...rest: T) {
  if (typeof valueEnum === 'function') {
    return valueEnum(...rest)
  }
  return valueEnum
}
