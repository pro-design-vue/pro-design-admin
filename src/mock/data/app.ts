/*
 * @Author: shen
 * @Date: 2025-05-28 10:25:44
 * @LastEditors: shen
 * @LastEditTime: 2025-08-12 11:11:06
 * @Description:
 */
import type { AppData } from '@/typings'

export const genAppData = (): AppData[] => {
  return [
    {
      id: '1',
      name: 'vue3',
      url: 'http://localhost:8095/',
      title: 'vue3应用',
    },
  ]
}
