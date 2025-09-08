/*
 * @Author: shen
 * @Date: 2025-05-12 13:51:31
 * @LastEditors: shen
 * @LastEditTime: 2025-08-16 11:17:26
 * @Description:
 */
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import legacy from '@vitejs/plugin-legacy'
import { viteHtmlPlugin } from './html'
import { viteCompressPlugin } from './compress'
import { viteVisualizerPlugin } from './visualizer'
import { PluginOption } from 'vite'
import { viteLicensePlugin } from './license'
import { viteArchiverPlugin } from './archiver'
import { viteInjectAppLoadingPlugin } from './app-loading'
import { viteMetadataPlugin } from './metadata'
export async function createPlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_ARCHIVER,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
    VITE_VISUALIZER,
  } = viteEnv

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => /^micro-app/.test(tag),
        },
      },
    }),
    vueJsx(),
    vueDevTools(),
  ]

  VITE_LEGACY && isBuild && vitePlugins.push(legacy())
  const appLoadingPlugin = await viteInjectAppLoadingPlugin(!!isBuild, viteEnv)
  vitePlugins.push(appLoadingPlugin)

  vitePlugins.push(viteHtmlPlugin(isBuild))

  vitePlugins.push(viteLicensePlugin())
  VITE_VISUALIZER && vitePlugins.push(viteVisualizerPlugin())
  VITE_ARCHIVER && vitePlugins.push(viteArchiverPlugin())
  if (isBuild) {
    vitePlugins.push(
      viteCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE),
    )
  }

  const metadataPlugin = await viteMetadataPlugin()
  vitePlugins.push(metadataPlugin)

  return vitePlugins
}
