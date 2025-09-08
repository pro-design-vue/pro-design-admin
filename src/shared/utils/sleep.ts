/*
 * @Author: shen
 * @Date: 2025-07-21 13:44:45
 * @LastEditors: shen
 * @LastEditTime: 2025-07-21 13:52:24
 * @Description:
 */

/**
 * @param ms 延迟毫秒
 */
export const sleep = (ms: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}
