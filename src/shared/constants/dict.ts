/*
 * @Author: shen
 * @Date: 2025-06-17 13:20:12
 * @LastEditors: shen
 * @LastEditTime: 2025-06-17 13:20:17
 * @Description:
 */

export interface LanguageOption {
  label: string
  value: 'en-US' | 'zh-CN'
}
/**
 * Supported languages
 */
export const SUPPORT_LANGUAGES: LanguageOption[] = [
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: 'English',
    value: 'en-US',
  },
]
