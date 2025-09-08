/*
 * @Author: shen
 * @Date: 2023-10-22 11:04:05
 * @LastEditors: shen
 * @LastEditTime: 2025-08-26 15:56:38
 * @Description:
 */
import { loadEnv } from 'vite'
import { parseEnv } from './util'
import { fileURLToPath, URL } from 'node:url'
import { createProxy } from './proxy'
import { createPlugins } from './plugin'
import { VITE_OUTPUT_DIR } from './constant'

import type { ConfigEnv } from 'vite'

export const createViteConfig = async (root: string, { command, mode }: ConfigEnv) => {
  const env = loadEnv(mode, root)
  const viteEnv = parseEnv(env)
  const isBuild = command === 'build'
  const { VITE_PORT, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv
  const plugins = await createPlugins(viteEnv, isBuild)
  return {
    root,
    base: viteEnv.VITE_PUBLIC_PATH,
    define: {
      // enable hydration mismatch details in production build
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url)),
      },
    },
    server: {
      host: true,
      open: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
      fs: {
        strict: false,
      },
    },
    esbuild: {
      drop: VITE_DROP_CONSOLE ? ['console', 'debugger'] : [],
    },
    build: {
      // target: 'esnext',
      cssTarget: 'chrome80',
      outDir: VITE_OUTPUT_DIR,
      chunkSizeWarningLimit: 2000,
    },
    plugins,
  }
}
