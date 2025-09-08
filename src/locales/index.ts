/*
 * @Author: shen
 * @Date: 2025-05-26 13:39:26
 * @LastEditors: shen
 * @LastEditTime: 2025-06-30 14:54:17
 * @Description:
 */
import type { App } from 'vue'
import type { Locale } from 'ant-design-vue/es/locale'
import type { LocaleSetupOptions, SupportedLanguagesType } from '@/shared/locales'
import { ref } from 'vue'
import { $t, setupI18n as coreSetup, loadLocalesMapFromDir } from '@/shared/locales'

import { preferences } from '@/shared/preferences'
import antdEnLocale from 'ant-design-vue/es/locale/en_US'
import antdDefaultLocale from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'

const antdLocale = ref<Locale>(antdDefaultLocale)
// const modules = await import.meta.glob('./langs/**/*.json') //vite 6.3.5有问题必须使用await
const modules = import.meta.glob('./langs/**/*.json')

const localesMap = loadLocalesMapFromDir(/\.\/langs\/([^/]+)\/(.*)\.json$/, modules)
/**
 * 加载应用特有的语言包
 * 这里也可以改造为从服务端获取翻译数据
 * @param lang
 */
async function loadMessages(lang: SupportedLanguagesType) {
  const [appLocaleMessages] = await Promise.all([localesMap[lang]?.(), loadThirdPartyMessage(lang)])
  return appLocaleMessages?.default
}

/**
 * 加载第三方组件库的语言包
 * @param lang
 */
async function loadThirdPartyMessage(lang: SupportedLanguagesType) {
  await Promise.all([loadAntdLocale(lang), loadDayjsLocale(lang)])
}

/**
 * 加载dayjs的语言包
 * @param lang
 */
async function loadDayjsLocale(lang: SupportedLanguagesType) {
  let locale
  switch (lang) {
    case 'en-US': {
      locale = await import('dayjs/locale/en')
      break
    }
    case 'zh-CN': {
      locale = await import('dayjs/locale/zh-cn')
      break
    }
    // 默认使用中文
    default: {
      locale = await import('dayjs/locale/zh-cn')
    }
  }
  if (locale) {
    dayjs.locale(locale)
  } else {
    console.error(`Failed to load dayjs locale for ${lang}`)
  }
}

/**
 * 加载antd的语言包
 * @param lang
 */
async function loadAntdLocale(lang: SupportedLanguagesType) {
  switch (lang) {
    case 'en-US': {
      antdLocale.value = antdEnLocale
      break
    }
    case 'zh-CN': {
      antdLocale.value = antdDefaultLocale
      break
    }
  }
}

async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  await coreSetup(app, {
    defaultLocale: preferences.app.locale,
    loadMessages,
    missingWarn: !import.meta.env.PROD,
    ...options,
  })
}

export { $t, antdLocale, setupI18n }
