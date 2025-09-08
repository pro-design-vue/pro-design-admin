<script setup lang="ts">
import { MdiGithub, MdiGoogle, MdiQqchat, MdiWechat } from '@/icons'
import { $t } from '@/locales'

import { Button, Divider } from 'ant-design-vue'

defineOptions({
  name: 'LoginThird',
})
</script>

<template>
  <div class="login-third">
    <Divider plain> {{ $t('authentication.thirdPartyLogin') }}</Divider>

    <div class="login-third-wrap">
      <Button shape="circle" type="text" class="login-third-btn">
        <template #icon>
          <MdiWechat />
        </template>
      </Button>
      <Button shape="circle" type="text" class="login-third-btn">
        <template #icon>
          <MdiQqchat />
        </template>
      </Button>
      <Button shape="circle" type="text" class="login-third-btn">
        <template #icon>
          <MdiGithub />
        </template>
      </Button>
      <Button shape="circle" type="text" class="login-third-btn">
        <template #icon>
          <MdiGoogle />
        </template>
      </Button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-third {
  width: 100%;

  &-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 16px;
    margin-bottom: 12px;
  }

  &-btn {
    font-size: 16px;
  }

  @media (min-width: 640px) {
    & {
      margin-right: auto;
      margin-left: auto;
    }
  }

  @media (min-width: 768px) {
    & {
      max-width: 448px;
    }
  }
}
</style>
