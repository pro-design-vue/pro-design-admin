/*
 * @Author: shen
 * @Date: 2025-05-12 16:29:40
 * @LastEditors: shen
 * @LastEditTime: 2025-09-08 16:07:35
 * @Description:
 */
import type { NormalizedOutputOptions, OutputBundle, OutputChunk } from 'rollup'
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
      handler: (_options: NormalizedOutputOptions, bundle: OutputBundle) => {
        const copyrightText = `/*!
  * Pro Design Admin
  * Author: shene
  * Copyright (C) 2025 Shene
  * License: MIT License
  * Contact: shen.it@foxmail.com
*/
              `.trim()

        for (const [, fileContent] of Object.entries(bundle)) {
          if (fileContent.type === 'chunk' && fileContent.isEntry) {
            const chunkContent = fileContent as OutputChunk
            // 插入版权信息
            const content = chunkContent.code
            const updatedContent = `${copyrightText}${EOL}${content}`

            // 更新bundle
            ;(fileContent as OutputChunk).code = updatedContent
          }
        }
      },
      order: 'post',
    },
    name: 'vite:license',
  }
}

export { viteLicensePlugin }
