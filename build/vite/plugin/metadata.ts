/*
 * @Author: shen
 * @Date: 2025-05-26 14:05:42
 * @LastEditors: shen
 * @LastEditTime: 2025-05-29 10:04:17
 * @Description:
 */
import type { PluginOption } from 'vite'
import { readPackageJSON } from 'pkg-types'
import dayjs from 'dayjs'
/**
 * 用于注入项目信息
 */
async function viteMetadataPlugin(root = process.cwd()): Promise<PluginOption | undefined> {
  const { author, description, homepage, license, version } = await readPackageJSON(root)

  const buildTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

  return {
    async config() {
      const isAuthorObject = typeof author === 'object'
      const authorName = isAuthorObject ? author.name : author
      const authorEmail = isAuthorObject ? author.email : null
      const authorUrl = isAuthorObject ? author.url : null

      return {
        define: {
          __PRO_ADMIN_METADATA__: JSON.stringify({
            authorEmail,
            authorName,
            authorUrl,
            buildTime,
            description,
            homepage,
            license,
            version,
          }),
          'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
        },
      }
    },
    enforce: 'post',
    name: 'vite:inject-metadata',
  }
}

export { viteMetadataPlugin }
