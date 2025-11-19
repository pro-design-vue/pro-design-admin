/*
 * @Author: shen
 * @Date: 2025-08-21 13:28:16
 * @LastEditors: shen
 * @LastEditTime: 2025-11-19 15:58:07
 * @Description:
 */
import type { AxiosResponse } from 'axios'
import type { RequestClient } from '../request-client'
import type { RequestClientConfig } from '../types'

type DownloadRequestConfig = {
  /**
   * 定义期望获得的数据类型。
   * raw: 原始的AxiosResponse，包括headers、status等。
   * body: 只返回响应数据的BODY部分(Blob)
   */
  responseReturn?: 'body' | 'raw'
  /**
   * 立刻下载
   */
  // immediate?: boolean
} & Omit<RequestClientConfig, 'responseReturn'>

class FileDownloader {
  private client: RequestClient

  constructor(client: RequestClient) {
    this.client = client
  }
  /**
   * 下载文件
   * @param url 文件的完整链接
   * @param config 配置信息，可选。
   * @returns 如果config.responseReturn为'body'，则返回Blob(默认)，否则返回RequestResponse<Blob>
   */
  public async download<T = Blob>(url: string, config?: DownloadRequestConfig): Promise<T | null> {
    const finalConfig: DownloadRequestConfig = {
      responseReturn: 'raw',
      ...config,
      responseType: 'blob',
    }

    const response = await this.client.get<T>(url, finalConfig)
    const { data } = response as AxiosResponse
    if (data instanceof Blob && data.type === 'application/json') {
      return null
    }
    return response
  }
}

export { FileDownloader }
