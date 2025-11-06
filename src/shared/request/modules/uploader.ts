/*
 * @Author: shen
 * @Date: 2025-08-21 13:28:16
 * @LastEditors: shen
 * @LastEditTime: 2025-11-06 09:24:14
 * @Description:
 */
import type { RequestClient } from '../request-client'
import type { RequestClientConfig } from '../types'

class FileUploader {
  private client: RequestClient

  constructor(client: RequestClient) {
    this.client = client
  }

  public async upload<T = any>(
    url: string,
    data: Record<string, any> | FormData,
    config?: RequestClientConfig,
  ): Promise<T> {
    let formData: Record<string, any> | FormData = new FormData()
    if (data instanceof FormData) {
      formData = data
    } else {
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item)
          })
        } else {
          formData.append(key, value)
        }
      })
    }

    const finalConfig: RequestClientConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    }

    return this.client.post(url, formData, finalConfig)
  }
}

export { FileUploader }
