/*
 * @Author: shen
 * @Date: 2025-05-27 13:49:13
 * @LastEditors: shen
 * @LastEditTime: 2025-05-27 13:49:48
 * @Description:
 */
export interface CommonFilterParams {
  keyword?: string
}

export interface PaginationParams extends CommonFilterParams {
  current?: number
  pageSize?: number
  [key: string]: any
}

export interface PaginationResult<T = any> {
  list: T[]
  total: number
}

export interface CommonData {
  id?: string
  createTime?: string
  modifyTime?: string
  remark?: string
  tenantId?: string
  value?: string
  label?: string
  text?: string
  key?: string
  [key: string]: any
}
