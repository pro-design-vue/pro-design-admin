<!--
 * @Author: shen
 * @Date: 2025-06-27 14:19:47
 * @LastEditors: shen
 * @LastEditTime: 2025-06-30 16:19:56
 * @Description:
-->
<script setup lang="ts">
import { reactive } from 'vue'
import { Form, Input, InputPassword, FormItem, Checkbox, Button } from 'ant-design-vue'
import { $t } from '@/locales'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'LoginForm',
})

interface FormState {
  username: string
  password: string
  remember: boolean
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

const router = useRouter()
const REMEMBER_ME_KEY = `REMEMBER_ME_USERNAME_${location.hostname}`
const localUsername = localStorage.getItem(REMEMBER_ME_KEY) || 'admin'
const formState = reactive<FormState>({
  username: localUsername,
  password: '123456',
  remember: !!localUsername,
})

function handleGo(path: string) {
  router.push(path)
}

const handleFinish = (values: any) => {
  localStorage.setItem(REMEMBER_ME_KEY, values.remember ? values?.username : '')
  emit('submit', values)
}
</script>

<template>
  <div class="login-form">
    <Form :model="formState" name="authentication_login" autocomplete="off" @finish="handleFinish">
      <FormItem
        name="username"
        :rules="[{ required: true, message: $t('authentication.usernameTip'), trigger: 'change' }]"
      >
        <Input
          v-model:value="formState.username"
          size="large"
          :placeholder="$t('authentication.username')"
        >
          <template #prefix>
            <UserOutlined />
          </template>
        </Input>
      </FormItem>
      <FormItem
        name="password"
        :rules="[{ required: true, message: $t('authentication.passwordTip'), trigger: 'change' }]"
      >
        <InputPassword
          v-model:value="formState.password"
          size="large"
          :placeholder="$t('authentication.password')"
        >
          <template #prefix>
            <LockOutlined />
          </template>
        </InputPassword>
      </FormItem>
      <div class="login-form-item">
        <FormItem name="remember" no-style>
          <Checkbox v-model:checked="formState.remember">{{
            $t('authentication.rememberMe')
          }}</Checkbox>
        </FormItem>
        <span class="pro-link login-form-forgot" @click="handleGo('/auth/forget-password')">{{
          $t('authentication.forgetPassword')
        }}</span>
      </div>
      <FormItem style="margin-top: 25px">
        <Button type="primary" :loading="loading" block size="large" html-type="submit">
          {{ $t('common.login') }}
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<style scoped lang="less">
.login-form {
  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-forgot {
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
