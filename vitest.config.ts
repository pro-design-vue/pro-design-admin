/*
 * @Author: shen
 * @Date: 2025-05-12 10:43:02
 * @LastEditors: shen
 * @LastEditTime: 2025-05-13 09:02:37
 * @Description:
 */
import { fileURLToPath } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [Vue(), VueJsx()],
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
})
