<!--
 * @Author: shen
 * @Date: 2025-06-27 14:19:47
 * @LastEditors: shen
 * @LastEditTime: 2025-07-01 09:45:25
 * @Description:
-->
<script setup lang="ts">
import { reactive } from 'vue'
import { Form, Input, FormItem, Button } from 'ant-design-vue'
import { EMAIL_REGEXP } from '@/shared/constants'
import { $t } from '@/locales'

defineOptions({
  name: 'ForgetPasswordForm',
})

interface FormState {
  email: string
}

interface Props {
  /**
   * @zh_CN 是否处于加载处理状态
   */
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  submit: [Recordable<any>]
}>()

const formState = reactive<FormState>({
  email: '',
})

function handleFinish(values: any) {
  emit('submit', values)
}
</script>

<template>
  <Form :model="formState" name="authentication_login" autocomplete="off" @finish="handleFinish">
    <FormItem
      name="email"
      :rules="[
        { required: true, message: $t('authentication.emailTip'), trigger: 'change' },
        {
          pattern: EMAIL_REGEXP,
          message: $t('authentication.emailValidErrorTip'),
          trigger: 'change',
        },
      ]"
    >
      <Input v-model:value="formState.email" size="large" placeholder="example@example.com" />
    </FormItem>
    <FormItem no-style>
      <Button type="primary" :loading="loading" block size="large" html-type="submit">
        {{ $t('authentication.sendResetLink') }}
      </Button>
    </FormItem>
  </Form>
</template>
