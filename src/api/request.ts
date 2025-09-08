/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { RequestClientOptions } from '@/shared/request'

import { preferences } from '@/shared/preferences'
import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@/shared/request'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores'
import { refreshTokenApi } from './core'
import config from '@/config'
import logger from '@/shared/logger'

// 通用业务返回模型定义，根据实际业务修改
// responseReturn=body时需要嵌套范型使用
export interface ResponseData<T = any> {
  code: number
  data: T
  message?: string
  [key: string]: any
}

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
  })

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ')
    const authStore = useAuthStore()
    authStore.setAccessToken(null)
    if (preferences.app.loginExpiredMode === 'modal' && authStore.isAccessChecked) {
      authStore.setLoginExpired(true)
    } else {
      await authStore.logout()
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const authStore = useAuthStore()
    const resp = await refreshTokenApi()
    const newToken = resp.data
    authStore.setAccessToken(newToken)
    return newToken
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const authStore = useAuthStore()
      config.headers.Authorization = formatToken(authStore.accessToken)
      config.headers['X-Request-Language'] = preferences.app.locale
      return config
    },
  })

  // 自定义处理返回业务数据
  // 如果没有特殊业务业务，请注释或删除此拦截器
  // 此拦截器一定要在defaultResponseInterceptor之前定义
  client.addResponseInterceptor({
    fulfilled: async (response) => {
      const { data: responseData } = response
      if (responseData.code !== 200) {
        message.error(responseData.message)
        logger.error(responseData.code, responseData.message)
      }
      return response
    },
  })

  // 处理返回的响应数据格式
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'code',
      dataField: 'data',
      successCode: 200,
    }),
  )

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  )

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
      const responseData = error?.response?.data ?? {}
      const errorMessage = responseData?.error ?? responseData?.message ?? ''
      // 如果没有错误信息，则会根据状态码进行提示
      message.error(config.isProd ? msg || errorMessage : errorMessage || msg)
      logger.error(error?.response?.status || responseData?.code, errorMessage || msg)
    }),
  )
  return client
}

export const genBaseURL = (): string => {
  let microUrl = preferences.micro.url
  if (microUrl.endsWith('/')) {
    microUrl = microUrl.slice(0, -1)
  }
  return config.powerByMicro ? microUrl + config.apiUrlPrefix : config.apiUrlPrefix
}
// body返回模式下数据结构，业务模型：{code: 200, data: 你的业务数据, message: 'success'}
export const requestClient = createRequestClient(genBaseURL(), {
  responseReturn: 'body',
})

// 此处只能创建新实例被mock代理, 不创建新实例会导致微前端模式下不发送请求
// 使用mock数据，需要设置环境变量 VITE_REQUEST_MOCK = true
export const mockClient = createRequestClient(genBaseURL(), {
  responseReturn: 'body',
})

// 返回最原始的axios response，没有任何拦截处理
export const baseRequestClient = new RequestClient({ baseURL: genBaseURL() })
