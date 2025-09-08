<!--
 * @Author: shen
 * @Date: 2025-05-27 09:09:23
 * @LastEditors: shen
 * @LastEditTime: 2025-09-04 16:14:30
 * @Description:
-->
<script setup lang="ts">
import { computed } from 'vue'
import { preferences, usePreferences } from '@/shared/preferences'
import { Copyright } from '../widgets'
import { Toolbar } from './toolbar'
import { Content } from './content'
import { $t } from '@/shared/locales'
import SloganIcon from './icons/slogan.vue'
import DefaultLogo from '@/assets/logo_small.png'

const appName = computed(() => preferences.app.name)
const logo = computed(() => preferences.logo.source || DefaultLogo)

const { authPanelCenter, authPanelLeft, authPanelRight, isDark } = usePreferences()

const clickLogo = () => {}
</script>

<template>
  <div class="authentication" :class="[isDark]">
    <Toolbar />
    <!-- 头部 Logo 和应用名称 -->
    <div v-if="logo || appName" class="authentication-logo" @click="clickLogo">
      <div class="authentication-logo-wrap">
        <img v-if="logo" :alt="appName" :src="logo" class="authentication-logo-img" width="42" />
        <p v-if="appName" class="authentication-logo-name">
          {{ appName }}
        </p>
      </div>
    </div>

    <!-- 左侧认证面板 -->
    <Content
      v-if="authPanelLeft"
      align="left"
      class="authentication-panel-left-content"
      transition-name="slide-left"
    >
      <template #footer>
        <Copyright v-if="preferences.copyright.enable" v-bind="preferences.copyright" />
      </template>
    </Content>

    <!-- 中心认证面板 -->
    <div v-if="authPanelCenter" class="authentication-panel-center">
      <div class="authentication-background"></div>
      <Content align="center" class="authentication-panel-center-content">
        <template #footer>
          <Copyright v-if="preferences.copyright.enable" v-bind="preferences.copyright" />
        </template>
      </Content>
    </div>
    <!-- 系统介绍 -->
    <div v-if="!authPanelCenter" class="authentication-introduce">
      <div class="authentication-introduce-wrap">
        <div class="authentication-background"></div>
        <div class="authentication-introduce-content">
          <SloganIcon :alt="appName" class="authentication-introduce-img" />
          <div class="authentication-introduce-title">
            {{ $t('authentication.pageTitle') }}
          </div>
          <div class="authentication-introduce-desc">
            {{ $t('authentication.pageDesc') }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧认证面板 -->
    <Content v-if="authPanelRight" class="authentication-panel-right-content" align="right">
      <template #footer>
        <Copyright v-if="preferences.copyright.enable" v-bind="preferences.copyright" />
      </template>
    </Content>
  </div>
</template>

<style lang="less" scoped>
.authentication {
  display: flex;
  flex: 1 1 0%;
  min-height: 100%;
  overflow-x: hidden;
  user-select: none;

  &-logo {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    flex: 1 1 0%;

    &-wrap {
      display: flex;
      flex: 1 1 0%;
      align-items: center;
      margin-top: 16px;
      margin-left: 16px;
      color: hsl(var(--pro-foreground));
    }

    &-img {
      margin-right: 8px;
    }

    &-name {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
    }

    @media (min-width: 1024px) {
      &-wrap {
        color: hsl(var(--pro-foreground)) !important;
      }
    }

    @media (min-width: 640px) {
      &-wrap {
        top: 24px !important;
        left: 24px !important;
      }
    }
  }

  &-introduce {
    position: relative;
    display: none;
    flex: 1 1 0%;
    width: 0;

    &-wrap {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background-color: hsl(var(--pro-background-deep));

      &:where(.dark, .dark *) {
        --tw-bg-opacity: 1;

        background-color: #070709;
      }
    }

    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      margin-right: 80px;

      &:nth-child(1) {
        opacity: 0;
        transform: translateX(-50px);
        animation: enter-x-animation 0.3s ease-in-out 0.1s forwards;
      }

      &:nth-child(2) {
        opacity: 0;
        transform: translateX(-50px);
        animation: enter-x-animation 0.3s ease-in-out 0.2s forwards;
      }

      &:nth-child(3) {
        opacity: 0;
        transform: translateX(-50px);
        animation: enter-x-animation 0.3s ease-in-out 0.3s forwards;
      }

      &:nth-child(4) {
        opacity: 0;
        transform: translateX(-50px);
        animation: enter-x-animation 0.3s ease-in-out 0.4s forwards;
      }

      &:nth-child(5) {
        opacity: 0;
        transform: translateX(-50px);
        animation: enter-x-animation 0.3s ease-in-out 0.5s forwards;
      }
    }

    &-img {
      width: 40%;
      height: 256px;
      animation: float 5s linear 0ms infinite;
    }

    &-title {
      margin-top: 24px;
      font-family: var(--font-family);
      color: hsl(var(--pro-foreground));

      @media (min-width: 1024px) {
        & {
          font-size: 24px;
          line-height: 32px;
        }
      }
    }

    &-desc {
      margin-top: 8px;

      &:where(.dark, .dark *) {
        color: hsl(var(--pro-muted-foreground));
      }
    }

    @media (min-width: 1024px) {
      & {
        display: block !important;
      }
    }
  }

  &-panel {
    &-center {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
  }

  &-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      154deg,
      #07070915 30%,
      hsl(var(--pro-primary) / 30%) 48%,
      #07070915 64%
    );
    filter: blur(100px);
  }

  .dark &-background {
    background: linear-gradient(
      154deg,
      #07070915 30%,
      hsl(var(--pro-primary) / 20%) 48%,
      #07070915 64%
    );
    filter: blur(100px);
  }

  @keyframes float {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-20px);
    }

    100% {
      transform: translateY(0);
    }
  }
}
</style>
