<!--
 * @Author: shen
 * @Date: 2025-06-30 16:01:53
 * @LastEditors: shen
 * @LastEditTime: 2025-07-01 09:23:12
 * @Description:
-->
<script setup lang="ts">
import { AuthTitle } from '@/components'
import { LoginForm } from './components'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import { Button } from 'ant-design-vue'

const router = useRouter()
const authStore = useAuthStore()

function handleGoBack() {
  router.go(-1)
}
</script>

<template>
  <div class="code-login">
    <AuthTitle>
      {{ `${$t('authentication.welcomeBack')} 📲` }}
      <template #desc>
        {{ $t('authentication.codeSubtitle') }}
      </template>
    </AuthTitle>
    <LoginForm :loading="authStore.loginLoading" @submit="authStore.authCodeLogin" />
    <Button block size="large" style="margin-top: 15px" @click="handleGoBack">
      {{ $t('common.back') }}
    </Button>
  </div>
</template>
