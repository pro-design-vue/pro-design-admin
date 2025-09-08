<script setup lang="ts">
import { reactive, ref } from 'vue'

import { LockKeyholeIcon } from '@/icons'
import { $t, useI18n } from '@/shared/locales'

import { useScrollLock } from '@/hooks'
import { ProButton } from 'pro-design-vue'
import { Avatar, Form, Input } from 'ant-design-vue'
import { useDateFormat, useNow } from '@vueuse/core'

interface Props {
  avatar?: string
}

interface FormState {
  lockScreenPassword: string
}

defineOptions({
  name: 'LockScreen',
})

withDefaults(defineProps<Props>(), {
  avatar: '',
})

const emit = defineEmits<{
  toLogin: []
  unLock: [lockScreenPassword: string]
}>()

const { locale } = useI18n()

const now = useNow()
const meridiem = useDateFormat(now, 'A')
const hour = useDateFormat(now, 'HH')
const minute = useDateFormat(now, 'mm')
const date = useDateFormat(now, 'YYYY-MM-DD dddd', { locales: locale.value })

const showUnlockForm = ref(false)

const formState = reactive<FormState>({
  lockScreenPassword: '',
})

const handleSubmit = (values: FormState) => {
  emit('unLock', values?.lockScreenPassword)
}

function toggleUnlockForm() {
  showUnlockForm.value = !showUnlockForm.value
  formState.lockScreenPassword = ''
}

useScrollLock()
</script>

<template>
  <div class="lock-screen">
    <transition name="slide-left">
      <div v-show="!showUnlockForm" class="lock-screen-wrap">
        <div class="lock-screen-unlock" @click="toggleUnlockForm">
          <LockKeyholeIcon class="lock-screen-unlock-icon" />
          <span>{{ $t('ui.widgets.lockScreen.unlock') }}</span>
        </div>
        <div class="lock-screen-time">
          <div class="lock-screen-time-hour">
            <span class="lock-screen-time-pm">
              {{ meridiem }}
            </span>
            {{ hour }}
          </div>
          <div class="lock-screen-time-minute">
            {{ minute }}
          </div>
        </div>
      </div>
    </transition>

    <transition name="slide-right">
      <div v-if="showUnlockForm" class="lock-screen-form">
        <div class="lock-screen-form-wrap">
          <Avatar :src="avatar" :size="80" class="lock-screen-form-avatar" />
          <div class="lock-screen-form-content">
            <Form ref="form" :model="formState" @finish="handleSubmit">
              <Form.Item
                name="lockScreenPassword"
                :rules="[{ required: true, message: $t('ui.widgets.lockScreen.placeholder') }]"
              >
                <Input.Password
                  v-model:value="formState.lockScreenPassword"
                  size="large"
                  :placeholder="$t('ui.widgets.lockScreen.placeholder')"
                />
              </Form.Item>
              <Form.Item>
                <ProButton
                  class="lock-screen-form-btn"
                  type="primary"
                  block
                  size="large"
                  html-type="submit"
                >
                  {{ $t('ui.widgets.lockScreen.entry') }}
                </ProButton>
              </Form.Item>
            </Form>
          </div>
          <ProButton
            type="text"
            size="large"
            block
            style="margin-top: -10px"
            class="lock-screen-form-btn"
            @click="$emit('toLogin')"
          >
            {{ $t('ui.widgets.lockScreen.backToLogin') }}
          </ProButton>
          <ProButton
            type="text"
            size="large"
            block
            style="margin-top: 5px"
            class="lock-screen-form-btn"
            @click="toggleUnlockForm"
          >
            {{ $t('common.back') }}
          </ProButton>
        </div>
      </div>
    </transition>

    <div class="lock-screen-date">
      <div v-if="showUnlockForm" class="lock-screen-date-minute">
        {{ hour }}:{{ minute }} <span class="text-lg">{{ meridiem }}</span>
      </div>
      <div class="lock-screen-date-text">{{ date }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.enter-x-animation() {
  &:nth-child(1) {
    opacity: 0;
    transform: translateX(50px);
    animation: enter-x-animation 0.3s ease-in-out 0.1s forwards;
  }

  &:nth-child(2) {
    opacity: 0;
    transform: translateX(50px);
    animation: enter-x-animation 0.3s ease-in-out 0.2s forwards;
  }

  &:nth-child(3) {
    opacity: 0;
    transform: translateX(50px);
    animation: enter-x-animation 0.3s ease-in-out 0.3s forwards;
  }

  &:nth-child(4) {
    opacity: 0;
    transform: translateX(50px);
    animation: enter-x-animation 0.3s ease-in-out 0.4s forwards;
  }

  &:nth-child(5) {
    opacity: 0;
    transform: translateX(50px);
    animation: enter-x-animation 0.3s ease-in-out 0.5s forwards;
  }
}

.lock-screen {
  position: fixed;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background-color: hsl(var(--pro-background));

  &-wrap {
    width: 100%;
    height: 100%;
  }

  &-unlock {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 16px 0;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    color: hsl(var(--pro-foreground) / 80%);
    cursor: pointer;

    &:hover {
      color: hsl(var(--pro-foreground));
    }

    &-icon {
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 300ms;
      transition-property: all;
    }

    &:hover &-icon {
      transform: scaleX(1.25) scaleY(1.25);
    }

    @media (min-width: 1280px) {
      &-date {
        font-size: 20px !important;
        line-height: 28px !important;
      }
    }

    @media (min-width: 1536px) {
      &-date {
        font-size: 30px !important;
        line-height: 36px !important;
      }
    }
  }

  &-time {
    display: flex;
    justify-content: center;
    height: 100%;
    padding-right: 10%;
    padding-left: 10%;

    &-hour {
      position: relative;
      display: flex;
      flex: 1 1 auto;
      align-items: center;
      justify-content: center;
      width: 40%;
      height: 80%;
      margin: 0 80px 56px 0;
      font-size: 260px;
      text-align: center;
      background-color: hsl(var(--pro-accent));
      border-radius: 24px;
    }

    &-minute {
      position: relative;
      display: flex;
      flex: 1 1 auto;
      align-items: center;
      justify-content: center;
      width: 40%;
      height: 80%;
      margin-bottom: 56px;
      font-size: 260px;
      text-align: center;
      background-color: hsl(var(--pro-accent));
      border-radius: 24px;
    }

    &-pm {
      position: absolute;
      top: 16px;
      left: 16px;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
    }
  }

  &-form {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    &-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 300px;
      margin-bottom: 40px;
    }

    &-avatar {
      margin-bottom: 24px;
      .enter-x-animation();
    }

    &-content {
      align-items: center;
      width: 100%;
      margin-bottom: 8px;
      .enter-x-animation();
    }

    &-btn {
      .enter-x-animation();
    }
  }

  &-date {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;

    &-minute {
      margin-bottom: 8px;
      font-size: 30px;
      line-height: 36px;
      .enter-x-animation();

      span {
        font-size: 18px;
        line-height: 28px;
      }
    }

    &-text {
      font-size: 30px;
      line-height: 36px;
    }
  }
}
</style>
