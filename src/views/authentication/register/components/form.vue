<!--
 * @Author: shen
 * @Date: 2025-06-27 14:19:47
 * @LastEditors: shen
 * @LastEditTime: 2025-07-01 11:05:42
 * @Description:
-->
<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'
import type { FormInstance } from 'ant-design-vue'
import { reactive, useTemplateRef } from 'vue'
import { Form, Input, InputPassword, FormItem, Checkbox, Button } from 'ant-design-vue'
import { $t } from '@/locales'

defineOptions({
  name: 'RegisterForm',
})

interface FormState {
  username: string
  password: string
  confirmPassword: string
  agreePolicy: boolean
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

const formInstance = useTemplateRef<FormInstance>('formRef')
const formState = reactive<FormState>({
  username: '',
  password: '',
  confirmPassword: '',
  agreePolicy: false,
})

const validatePassword = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject($t('authentication.passwordTip'))
  } else {
    if (formState.confirmPassword !== '') {
      formInstance.value?.validateFields('confirmPassword')
    }
    return Promise.resolve()
  }
}
const validateConfirmPassword = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject($t('authentication.passwordTip'))
  } else if (value !== formState.password) {
    return Promise.reject($t('authentication.confirmPasswordTip'))
  } else {
    return Promise.resolve()
  }
}

const checkAgreePolicy = async (_rule: Rule, value: number) => {
  if (!value) {
    return Promise.reject($t('authentication.agreeTip'))
  }
  return Promise.resolve()
}

const handleFinish = (values: any) => {
  emit('submit', values)
}
</script>

<template>
  <Form
    ref="formRef"
    :model="formState"
    name="authentication_login"
    autocomplete="off"
    @finish="handleFinish"
  >
    <FormItem
      name="username"
      :rules="[{ required: true, message: $t('authentication.usernameTip'), trigger: 'change' }]"
    >
      <Input
        v-model:value="formState.username"
        size="large"
        :placeholder="$t('authentication.usernameTip')"
      />
    </FormItem>
    <FormItem
      name="password"
      :extra="$t('authentication.passwordStrength')"
      :rules="[{ required: true, validator: validatePassword, trigger: 'change' }]"
    >
      <InputPassword
        v-model:value="formState.password"
        size="large"
        :placeholder="$t('authentication.password')"
      />
    </FormItem>
    <FormItem
      name="confirmPassword"
      :rules="[{ validator: validateConfirmPassword, trigger: 'change' }]"
    >
      <InputPassword
        v-model:value="formState.confirmPassword"
        size="large"
        :placeholder="$t('authentication.confirmPassword')"
      />
    </FormItem>
    <FormItem name="agreePolicy" :rules="[{ validator: checkAgreePolicy, trigger: 'change' }]">
      <Checkbox v-model:checked="formState.agreePolicy">
        {{ $t('authentication.agree') }}
        <a class="pro-link">{{
          `${$t('authentication.privacyPolicy')} & ${$t('authentication.terms')}`
        }}</a>
      </Checkbox>
    </FormItem>
    <FormItem style="margin-top: 25px">
      <Button type="primary" :loading="loading" block size="large" html-type="submit">
        {{ $t('authentication.signUp') }}
      </Button>
    </FormItem>
  </Form>
</template>
