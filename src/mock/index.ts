/*
 * @Author: shen
 * @Date: 2025-05-28 10:02:12
 * @LastEditors: shen
 * @LastEditTime: 2025-08-22 10:43:49
 * @Description:
 */
import type { ResponseData } from '@/api/request'
import type { AppData, MenuData, UserData } from '@/typings'
import { genUserData, genMenuData } from './data'
import { genAppData } from './data/app'
import { mockClient, genBaseURL } from '@/api/request'
import AxiosMockAdapter from 'axios-mock-adapter'

const mock = new AxiosMockAdapter(mockClient.instance, {
  delayResponse: 500,
})

const BASH_URL = genBaseURL()

function createResponseResult<T>(data: T, code?: number, message?: string): ResponseData<T> {
  return {
    data,
    code: code || 200,
    message: message || '',
  }
}

export const setupMockData = () => {
  mock
    .onPost(`${BASH_URL}/v1/auth/login`)
    .reply<ResponseData<{ accessToken: string; realName?: string }>>((config) => {
      const headers = config.headers!
      const userData = genUserData(headers['X-Request-Language'])
      const data = JSON.parse(config.data || '{}')
      const user = userData.find(
        (item) => item.username === data.username && item.password === data.password,
      )
      return [
        200,
        createResponseResult(
          user
            ? {
                realName: user.realName,
                accessToken: user.username,
              }
            : null,
          user ? 200 : 10001,
          user
            ? ''
            : headers['X-Request-Language'] === 'zh-CN'
              ? '用户名或密码错误'
              : 'Incorrect username or password',
        ),
      ]
    })

  mock.onGet(`${BASH_URL}/v1/auth/user`).reply<ResponseData<UserData>>((config) => {
    const headers = config.headers!
    const userData = genUserData(headers['X-Request-Language'])
    const authorization = headers['Authorization']
    const username = authorization.split(' ')[1]
    const user = userData.find((item) => item.username === username)
    return [200, createResponseResult(user)]
  })

  mock.onGet(`${BASH_URL}/v1/auth/menus`).reply<ResponseData<MenuData[]>>((config) => {
    const headers = config.headers!
    const menuData = genMenuData(headers['X-Request-Language'])
    return [200, createResponseResult(menuData)]
  })

  mock.onGet(`${BASH_URL}/v1/auth/apps`).reply<ResponseData<AppData[]>>(() => {
    const appData = genAppData()
    return [200, createResponseResult(appData)]
  })

  mock.onAny().passThrough()
}
