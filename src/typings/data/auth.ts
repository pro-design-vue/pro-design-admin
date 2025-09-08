/*
 * @Author: shen
 * @Date: 2023-05-24 14:50:27
 * @LastEditors: shen
 * @LastEditTime: 2025-06-30 14:03:41
 * @Description:
 */
export interface AuthCaptchaResult {
  img?: string
  id: string
}
export interface AuthSigninParams {
  username?: string
  password?: string
  verifyCode?: string
  captchaId?: string
  from?: string
  loginType?: 'password' | 'code' | 'email' | 'weibo-web' | 'qq-web' | 'dingtalk-web' | 'wechat-web'
}

export interface AuthBindEmailParams {
  emial?: string
  verifyCode?: string
  captchaId?: string
}

export interface AuthSigninResult {
  accessToken: string
  realName?: string
  username?: string
  homePath?: string
  isInit?: string
}
