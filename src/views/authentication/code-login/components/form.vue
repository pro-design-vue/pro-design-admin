<!--
 * @Author: shen
 * @Date: 2025-06-27 14:19:47
 * @LastEditors: shen
 * @LastEditTime: 2025-07-02 11:03:05
 * @Description:
-->
<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'

import { computed, onBeforeUnmount, reactive, ref, useTemplateRef } from 'vue'
import { Form, Input, FormItem, Button, InputGroup } from 'ant-design-vue'
import { PHONE_REGEXP } from '@/shared/constants'
import { $t } from '@/locales'

defineOptions({
  name: 'CodeLoginForm',
})

interface FormState {
  phoneNumber: string
  code: string
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

const maxTime = 60
const countdown = ref(0)
const codeLoading = ref(false)
const timer = ref<ReturnType<typeof setTimeout>>()
const formInstance = useTemplateRef<FormInstance>('formRef')
const formState = reactive<FormState>({
  phoneNumber: '',
  code: '',
})

const btnLoading = computed(() => codeLoading.value || countdown.value > 0)

function handleFinish(values: any) {
  emit('submit', values)
}

async function handleSend(e: Event) {
  try {
    e?.preventDefault()
    await formInstance.value?.validate('phoneNumber')
    codeLoading.value = true
    await handleSendCode() //此处调用发送验证码接口
    countdown.value = maxTime
    startCountdown()
  } catch (_) {
  } finally {
    codeLoading.value = false
  }
}

async function handleSendCode() {}

function startCountdown() {
  if (countdown.value > 0) {
    timer.value = setTimeout(() => {
      countdown.value--
      startCountdown()
    }, 1000)
  }
}

onBeforeUnmount(() => {
  countdown.value = 0
  clearTimeout(timer.value)
})
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
      name="phoneNumber"
      :rules="[
        { required: true, message: $t('authentication.mobileTip'), trigger: 'change' },
        {
          pattern: PHONE_REGEXP,
          message: $t('authentication.mobileErrortip'),
          trigger: 'change',
        },
      ]"
    >
      <Input
        v-model:value="formState.phoneNumber"
        size="large"
        :placeholder="$t('authentication.mobile')"
      />
    </FormItem>
    <FormItem
      name="code"
      :rules="[{ required: true, message: $t('authentication.codeTip'), trigger: 'change' }]"
    >
      <InputGroup compact>
        <Input
          v-model:value="formState.code"
          size="large"
          type="number"
          style="width: calc(100% - 180px)"
          :placeholder="$t('authentication.code')"
        />
        <Button size="large" style="width: 180px" :loading="btnLoading" @click="handleSend">
          {{
            countdown > 0
              ? $t('authentication.sendText', [countdown])
              : $t('authentication.sendCode')
          }}
        </Button>
      </InputGroup>
    </FormItem>
    <FormItem no-style>
      <Button type="primary" :loading="loading" block size="large" html-type="submit">
        {{ $t('common.login') }}
      </Button>
    </FormItem>
  </Form>
</template>
