/*
 * @Author: shen
 * @Date: 2023-11-28 15:41:08
 * @LastEditors: shen
 * @LastEditTime: 2025-06-30 13:52:21
 * @Description:
 */
import { notification as antdNotification } from 'ant-design-vue'
import { $t } from '@/shared/locales'
import type { NotificationInstance, NotificationArgsProps } from 'ant-design-vue/es/notification'

export const notification = (message: string, type?: keyof NotificationInstance) => {
  const _type = type ?? 'success'
  const config: NotificationArgsProps = {
    message: $t('common.prompt'),
    description: message,
    closeIcon: '',
    duration: 3,
  }
  return antdNotification[_type](config)
}
