/*
 * @Author: shen
 * @Date: 2025-05-12 16:29:40
 * @LastEditors: shen
 * @LastEditTime: 2025-09-08 16:07:35
 * @Description:
 */
import type { PluginOption } from 'vite'

import { EOL } from 'node:os'

/**
 * 用于注入版权信息
 * @returns
 */

function viteLicensePlugin(): PluginOption | undefined {
  return {
    apply: 'build',
    enforce: 'post',
    generateBundle: {
      handler: (_options, bundle) => {
        const copyrightText = `/*!
  * Pro Design Admin
  * Author: shene
  * Copyright (C) 2025 Shene
  * License: MIT License
  * Contact: shen.it@foxmail.com
*/
              `.trim()

        for (const fileContent of Object.values(bundle)) {
          if (fileContent.type === 'chunk' && fileContent.isEntry) {
            // 插入版权信息
            fileContent.code = `${copyrightText}${EOL}${fileContent.code}`
          }
        }
      },
      order: 'post',
    },
    name: 'vite:license',
  }
}

export { viteLicensePlugin }
