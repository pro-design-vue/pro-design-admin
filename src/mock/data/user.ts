/*
 * @Author: shen
 * @Date: 2025-05-28 10:25:44
 * @LastEditors: shen
 * @LastEditTime: 2025-06-30 13:22:03
 * @Description:
 */
import type { UserData } from '@/typings'

export const userInfo: UserData = {
  id: '1',
  username: 'admin',
  realName: '管理员',
}

export const genUserData = (lang: 'zh-CN' | 'en-US' = 'zh-CN'): UserData[] => {
  return [
    {
      id: '1',
      username: 'admin',
      password: '123456',
      realName: lang === 'zh-CN' ? '管理员' : 'Admin',
    },
    {
      id: '2',
      userName: 'test',
      username: '123456',
      realName: lang === 'zh-CN' ? '测试人员' : 'Test',
    },
  ]
}
