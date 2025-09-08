/*
 * @Author: shen
 * @Date: 2023-10-21 22:24:48
 * @LastEditors: shen
 * @LastEditTime: 2024-01-15 16:26:18
 * @Description:
 */
export const COUNT_REGEXP = /^[a-zA-Z][a-zA-Z0-9_]{3,40}$/
export const DICT_CODE_REGEXP = /^[a-zA-Z0-9_\\-]{1,40}$/
export const PASSWORD_REGEXP = /[a-zA-Z0-9_!-@#$]{7,40}$/
export const CODE_REGEXP = /^[a-zA-Z][a-zA-Z0-9_\\-]{3,40}$/
export const PATH_REGEXP = /^(\/:?[a-zA-Z0-9]+(_?-?[a-zA-Z0-9])*)+$/
export const IDCARD_REGEXP =
  /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
export const TELEPHONE_REGEXP = /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}/
export const URL_REGEXP =
  /^((http:\/\/)|(https:\/\/))?([a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(\/)/
export const IP_REGEXP = /((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))/
export const CHARACTER_REGEXP = /^[\u4e00-\u9fa5]{0,}$/
export const EMAIL_REGEXP =
  /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
// export const EMAIL_REGEXP = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
export const PHONE_REGEXP =
  /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/
