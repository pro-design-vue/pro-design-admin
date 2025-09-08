/*
 * @Author: shen
 * @Date: 2023-10-22 11:04:05
 * @LastEditors: shen
 * @LastEditTime: 2025-09-08 20:55:14
 * @Description:
 */
import { loadEnv } from 'vite'
import { parseEnv } from './util'
import { fileURLToPath, URL } from 'node:url'
import { createProxy } from './proxy'
import { createPlugins } from './plugin'
import { VITE_OUTPUT_DIR } from './constant'

import type { ConfigEnv } from 'vite'

const INVALID_CHAR_REGEX = /[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g
const DRIVE_LETTER_REGEX = /^[a-z]:/i

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
      rollupOptions: {
        output: {
          // https://github.com/rollup/rollup/blob/master/src/utils/sanitizeFileName.ts
          sanitizeFileName(name) {
            const match = DRIVE_LETTER_REGEX.exec(name)
            const driveLetter = match ? match[0] : ''
            return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, '')
          },
        },
      },
    },
    plugins,
  }
}
