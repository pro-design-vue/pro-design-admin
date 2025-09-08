<!--
 * @Author: shen
 * @Date: 2025-06-30 16:01:53
 * @LastEditors: shen
 * @LastEditTime: 2025-07-01 09:44:59
 * @Description:
-->
<script setup lang="ts">
import { AuthTitle } from '@/components'
import { useRouter } from 'vue-router'
import { Button } from 'ant-design-vue'
import { LoginForm } from './components'
import { useAuthStore } from '@/stores'

const router = useRouter()
const authStore = useAuthStore()
function handleGoBack() {
  router.go(-1)
}

function handleSubmit() {}
</script>

<template>
  <div class="forget-password">
    <AuthTitle>
      {{ `${$t('authentication.forgetPassword')} 🤦🏻‍♂️` }}
      <template #desc>
        {{ $t('authentication.forgetPasswordSubtitle') }}
      </template>
    </AuthTitle>
    <LoginForm :loading="authStore.loginLoading" @submit="handleSubmit" />
    <Button block size="large" style="margin-top: 15px" @click="handleGoBack">
      {{ $t('common.back') }}
    </Button>
  </div>
</template>
