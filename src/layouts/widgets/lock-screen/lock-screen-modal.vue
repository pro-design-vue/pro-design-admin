<!--
 * @Author: shen
 * @Date: 2025-06-18 10:24:35
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 15:51:19
 * @Description:
-->
<script setup lang="ts">
import { reactive, useTemplateRef } from 'vue'

import { $t } from '@/shared/locales'
import { ProButton } from 'pro-design-vue'
import { Avatar, Modal, Form, Input } from 'ant-design-vue'

interface Props {
  avatar?: string
  text?: string
}

defineOptions({
  name: 'LockScreenModal',
})

withDefaults(defineProps<Props>(), {
  avatar: '',
  text: '',
})

const emit = defineEmits<{
  submit: [lockScreenPassword: string]
}>()

const formRef = useTemplateRef<any>('form')
const openModal = defineModel<boolean>('openLockModal', {
  default: false,
})

interface FormState {
  lockScreenPassword: string
}

const formState = reactive<FormState>({
  lockScreenPassword: '',
})

const handleSubmit = (values: FormState) => {
  emit('submit', values?.lockScreenPassword)
  formRef.value?.resetFields()
}

const handleClose = () => {
  formRef.value?.resetFields()
}
</script>

<template>
  <Modal
    v-model:open="openModal"
    :title="$t('ui.widgets.lockScreen.title')"
    :width="520"
    :body-style="{ paddingInlineStart: '50px', paddingInlineEnd: '50px' }"
    :footer="null"
    class="lock-screen-modal"
    @cancel="handleClose"
  >
    <div class="lock-screen-modal-info">
      <div class="lock-screen-modal-info-avatar">
        <Avatar :src="avatar" :size="80" />
      </div>
      <div class="lock-screen-modal-info-text">
        {{ text }}
      </div>
    </div>
    <div class="lock-screen-modal-form">
      <Form ref="form" :model="formState" @finish="handleSubmit">
        <Form.Item
          name="lockScreenPassword"
          :rules="[{ required: true, message: $t('ui.widgets.lockScreen.placeholder') }]"
        >
          <Input.Password
            v-model:value="formState.lockScreenPassword"
            size="large"
            :placeholder="$t('ui.widgets.lockScreen.placeholder')"
          />
        </Form.Item>
        <Form.Item>
          <ProButton type="primary" block size="large" html-type="submit">
            {{ $t('ui.widgets.lockScreen.screenButton') }}
          </ProButton>
        </Form.Item>
      </Form>
    </div>
  </Modal>
</template>

<style scoped lang="less">
.lock-screen-modal {
  &-info {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-text {
      margin: 24px 0;
      font-size: 16px;
      font-weight: 500;
      color: hsl(var(--pro-foreground));
    }
  }
}
</style>
