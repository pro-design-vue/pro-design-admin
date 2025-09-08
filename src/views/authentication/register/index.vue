<!--
 * @Author: shen
 * @Date: 2025-06-30 16:01:53
 * @LastEditors: shen
 * @LastEditTime: 2025-07-01 09:47:25
 * @Description:
-->
<script setup lang="ts">
import { AuthTitle } from '@/components'
import { LoginForm } from './components'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'

const router = useRouter()
const authStore = useAuthStore()

function handleGoBack() {
  router.go(-1)
}

function handleSubmit() {}
</script>

<template>
  <div class="registry">
    <AuthTitle>
      {{ `${$t('authentication.createAnAccount')} 🚀` }}
      <template #desc>
        {{ $t('authentication.signUpSubtitle') }}
      </template>
    </AuthTitle>
    <LoginForm :loading="authStore.loginLoading" @submit="handleSubmit" />
    <div class="registry-login">
      {{ $t('authentication.alreadyHaveAccount') }}
      <span class="pro-link registry-login-link" @click="handleGoBack()">
        {{ $t('authentication.goToLogin') }}
      </span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.registry {
  &-login {
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
