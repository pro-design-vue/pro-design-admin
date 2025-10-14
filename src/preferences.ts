/*
 * @Author: shen
 * @Date: 2025-05-10 22:33:31
 * @LastEditors: shen
 * @LastEditTime: 2025-10-14 09:00:53
 * @Description:
 */

import { VITE_APP_LANGUAGE, VITE_APP_THEME_COLOR, VITE_APP_TITLE } from './shared/constants'
import type { Preferences } from './shared/preferences'

function defineOverridesPreferences(preferences: DeepPartial<Preferences>) {
  return preferences
}

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  app: {
    name: VITE_APP_TITLE,
    locale: VITE_APP_LANGUAGE,
    layout: 'sidebar-nav',
  },
  breadcrumb: {
    showHome: true,
    showIcon: true,
  },
  theme: {
    colorPrimary: VITE_APP_THEME_COLOR,
    mode: 'light',
    semiDarkSidebar: true,
    semiDarkHeader: false,
  },
  footer: {
    enable: false,
  },
  tabbar: {
    styleType: 'chrome',
  },
})
