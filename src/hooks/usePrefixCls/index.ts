/*
 * @Author: shen
 * @Date: 2025-05-30 09:20:20
 * @LastEditors: shen
 * @LastEditTime: 2025-08-14 09:46:32
 * @Description:
 */
import config from '@/config'

function usePrefixCls(name: string) {
  return `${config.prefixCls || 'pro'}-${name}`
}

export { usePrefixCls }
