/*
 * @Author: shen
 * @Date: 2025-05-27 13:41:56
 * @LastEditors: shen
 * @LastEditTime: 2026-01-05 09:10:51
 * @Description:
 */
import type { AppData, AuthSigninParams, AuthSigninResult, MenuData, UserData } from '@/typings'

import type { ResponseData } from '@/api/request'

import { baseRequestClient, requestClient, mockClient } from '@/api/request'

const BASE_PATH = '/v1/auth'
/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post('/auth/refresh', {
    withCredentials: true,
  })
}

export const authLoginApi = (params: AuthSigninParams) =>
  mockClient.post<ResponseData<AuthSigninResult>>(`${BASE_PATH}/login`, params)
export const getAuthUserInfo = () => mockClient.get<ResponseData<UserData>>(`${BASE_PATH}/user`)
export const getAuthMenuList = () => mockClient.get<ResponseData<MenuData[]>>(`${BASE_PATH}/menus`)
export const getAuthApps = () => mockClient.get<ResponseData<AppData[]>>(`${BASE_PATH}/apps`)
