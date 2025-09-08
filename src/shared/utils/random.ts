/*
 * @Author: shen
 * @Date: 2023-10-14 15:01:25
 * @LastEditors: shen
 * @LastEditTime: 2025-06-21 17:05:22
 * @Description:
 */
export const randomString = (len: number = 16) => {
  const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const a = t.length
  let n = ''
  for (let i = 0; i < len; i++) n += t.charAt(Math.floor(Math.random() * a))
  return n
}
export default randomString
