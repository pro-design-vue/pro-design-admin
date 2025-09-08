/*
 * @Author: shen
 * @Date: 2024-01-04 11:47:15
 * @LastEditors: shen
 * @LastEditTime: 2025-08-26 20:53:30
 * @Description:
 */
import { Modal, type ModalFuncProps } from 'ant-design-vue'
import {
  WarningFilled,
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import { h } from 'vue'
import { isPromise } from '../validate'

type ConfirmType = 'danger' | 'warning'

export const confirm = (props: Omit<ModalFuncProps, 'type'> & { type?: ConfirmType }) => {
  const {
    type,
    title = '提示',
    icon,
    content = '',
    okButtonProps,
    onOk,
    onCancel,
    ...restProps
  } = props ?? {}
  Modal.confirm({
    title,
    content,
    icon:
      icon ??
      h(
        type === 'danger'
          ? ExclamationCircleFilled
          : type === 'warning'
            ? WarningFilled
            : ExclamationCircleOutlined,
        {
          style: {
            color: type === 'danger' ? 'hsl(var(--pro-destructive))' : 'hsl(var(--pro-warning))',
          },
        },
      ),
    okButtonProps: {
      danger: type === 'danger',
      ...okButtonProps,
    },
    async onOk(...args) {
      if (isPromise(onOk)) {
        return await new Promise(() => {
          onOk?.(args)
        })
      }
      return onOk?.(args)
    },
    async onCancel(...args) {
      return onCancel?.(args)
    },
    ...restProps,
  })
}
