/*
 * @Author: shen
 * @Date: 2022-10-03 14:41:13
 * @LastEditors: shen
 * @LastEditTime: 2025-07-17 11:10:52
 * @Description:
 */
import type { PluginOption } from 'vite'
import type { Algorithm } from 'vite-plugin-compression2'

import { compression } from 'vite-plugin-compression2'

export function viteCompressPlugin(
  compress: 'gzip' | 'brotli' | 'none',
  deleteOriginalAssets = false,
): PluginOption | PluginOption[] {
  const compressList = compress.split(',')

  const plugins: PluginOption[] = []
  if (compressList?.length > 0) {
    const algorithms: Algorithm[] = []
    if (compressList.includes('gzip')) {
      algorithms.push('gzip')
    }

    if (compressList.includes('brotli')) {
      algorithms.push('brotliCompress')
    }
    if (algorithms?.length > 0) {
      plugins.push(
        compression({
          algorithms,
          threshold: 1024,
          exclude: [/\.(br)$/, /\.(gz)$/],
          deleteOriginalAssets,
        }),
      )
    }
  }
  return plugins
}
