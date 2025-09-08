<!--
 * @Author: shen
 * @Date: 2025-06-30 16:01:53
 * @LastEditors: shen
 * @LastEditTime: 2025-07-01 09:22:13
 * @Description:
-->
<script setup lang="ts">
import { ref } from 'vue'
import { AuthTitle } from '@/components'
import { useRouter } from 'vue-router'
import { Button, QRCode } from 'ant-design-vue'

const router = useRouter()
const text = ref('https://github.com/xh-shen')
function handleGoBack() {
  router.go(-1)
}
</script>

<template>
  <div class="qrcode-login">
    <AuthTitle>
      {{ `${$t('authentication.welcomeBack')} 📱` }}
      <template #desc>
        {{ $t('authentication.qrcodeSubtitle') }}
      </template>
    </AuthTitle>
    <div class="qrcode-login-wrap">
      <QRCode :size="180" :value="text" :bordered="false" />
      <p class="qrcode-login-prompt">
        {{ $t('authentication.qrcodePrompt') }}
      </p>
    </div>
    <Button block size="large" style="margin-top: 15px" @click="handleGoBack">
      {{ $t('common.back') }}
    </Button>
  </div>
</template>

<style scoped lang="less">
.qrcode-login {
  &-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-prompt {
    margin-top: 16px;
    font-size: 14px;
    line-height: 20px;
    color: hsl(var(--pro-muted-foreground));
  }
}
</style>
