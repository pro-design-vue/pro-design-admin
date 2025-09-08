/*
 * @Author: shen
 * @Date: 2022-10-03 14:01:33
 * @LastEditors: shen
 * @LastEditTime: 2025-06-10 17:00:49
 * @Description:
 */
import type { PluginOption } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export function viteHtmlPlugin(isBuild: boolean) {
  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    minify: isBuild,
  })
  return htmlPlugin
}
