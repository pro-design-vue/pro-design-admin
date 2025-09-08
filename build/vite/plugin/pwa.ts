/*
 * @Author: shen
 * @Date: 2022-10-03 14:30:12
 * @LastEditors: shen
 * @LastEditTime: 2025-05-13 08:55:20
 * @Description:
 */
import { PluginOption } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export function vitePwaPlugin() {
  return VitePWA({
    injectRegister: false,
    workbox: {
      globPatterns: [],
    },
    manifest: {
      display: 'standalone',
      start_url: '/',
      theme_color: '#ffffff',
    },
  }) as PluginOption
}
