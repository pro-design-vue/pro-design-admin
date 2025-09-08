/*
 * @Author: shen
 * @Date: 2025-05-27 13:49:07
 * @LastEditors: shen
 * @LastEditTime: 2025-06-30 13:22:36
 * @Description:
 */
import type { CommonData } from './common'

export interface UserData extends CommonData {
  realName: string
  username: string
  homePath?: string
}
