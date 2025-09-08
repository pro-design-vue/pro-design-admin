/*
 * @Author: shen
 * @Date: 2025-05-12 10:43:02
 * @LastEditors: shen
 * @LastEditTime: 2025-08-26 16:28:53
 * @Description:
 */
import { defineConfig, loadEnv, mergeConfig } from 'vite'
import { createViteConfig } from './build'

import type { ConfigEnv } from 'vite'
import { parseEnv } from './build/vite/util'

export default defineConfig(async ({ command, mode }: ConfigEnv) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const viteConfig = await createViteConfig(root, { command, mode })
  const viteEnv = parseEnv(env)
  const { VITE_APP_NAMESPACE, VITE_APP_ANTD_PREFIX_CLS } = viteEnv
  return mergeConfig(viteConfig, {
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            prefixCls: VITE_APP_NAMESPACE || 'pro',
            'ant-prefix': VITE_APP_ANTD_PREFIX_CLS || 'ant',
          },
          javascriptEnabled: true,
        },
      },
    },
  })
})
