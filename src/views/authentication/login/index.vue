<!--
 * @Author: shen
 * @Date: 2025-05-27 09:12:43
 * @LastEditors: shen
 * @LastEditTime: 2025-10-19 17:57:07
 * @Description:
-->
<script setup lang="ts">
import { Button } from 'ant-design-vue'
import { AuthTitle } from '@/components'
import { LoginForm, LoginThird } from './components'
import { useAuthStore } from '@/stores'
import { useRouter } from 'vue-router'

interface Props {
  showThirdPartyLogin?: boolean
  showForgetPassword?: boolean
  showRegister?: boolean
  showRememberMe?: boolean
  center?: boolean
  subTitle?: string
  title?: string
}

const {
  showForgetPassword = true,
  showThirdPartyLogin = true,
  showRegister = true,
  showRememberMe = true,
  center = false,
} = defineProps<Props>()
const router = useRouter()
const authStore = useAuthStore()

function handleGo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="login">
    <AuthTitle :style="{ textAlign: center ? 'center' : 'left' }">
      {{ title || `${$t('authentication.welcomeBack')} 👋🏻` }}
      <template #desc>
        {{ subTitle || $t('authentication.loginSubtitle') }}
      </template>
    </AuthTitle>
    <LoginForm
      :showRememberMe
      :showForgetPassword
      :loading="authStore.loginLoading"
      @submit="authStore.authLogin"
    />
    <div class="login-other">
      <Button block size="large" @click="handleGo('/auth/code-login')">
        {{ $t('authentication.mobileLogin') }}
      </Button>
      <Button block size="large" @click="handleGo('/auth/qrcode-login')">
        {{ $t('authentication.qrcodeLogin') }}
      </Button>
    </div>
    <LoginThird v-if="showThirdPartyLogin" />
    <div class="login-registry" v-if="showRegister">
      {{ $t('authentication.accountTip') }}
      <span class="pro-link login-registry-link" @click="handleGo('/auth/register')">
        {{ $t('authentication.createAccount') }}
      </span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login {
  &-other {
    display: flex;
    gap: 16px;
    margin-top: -8px;
  }

  &-registry {
    margin-top: 20px;
    font-size: 14px;
    line-height: 20px;
    text-align: center;

    &-link {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
  }
}
</style>
