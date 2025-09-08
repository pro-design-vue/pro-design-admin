/*
 * @Author: shen
 * @Date: 2022-10-03 14:30:12
 * @LastEditors: shen
 * @LastEditTime: 2025-05-12 17:18:05
 * @Description:
 */
import { PluginOption } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export function viteVisualizerPlugin() {
  return visualizer({
    filename: './node_modules/.cache/visualizer/stats.html',
    open: true,
    gzipSize: true,
    brotliSize: true,
  }) as PluginOption
}
