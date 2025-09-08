/*
 * @Author: shen
 * @Date: 2025-07-04 13:28:11
 * @LastEditors: shen
 * @LastEditTime: 2025-07-04 13:39:11
 * @Description:
 */
interface ProFallbackProps {
  /**
   * 描述
   */
  description?: string
  /**
   * @zh_CN 默认显示的图片
   * @default pageNotFoundSvg
   */
  image?: string
  /**
   *  @zh_CN 内置类型
   */
  status?: '403' | '404' | '500' | 'coming-soon' | 'offline'
  /**
   *  @zh_CN 页面提示语
   */
  title?: string

  /**
   * 显示返回首页按钮
   */
  showBackBtn?: boolean

  /**
   * 显示刷新按钮
   */
  showRefreshBtn?: boolean
}
export type { ProFallbackProps }
