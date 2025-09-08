<!--
 * @Author: shen
 * @Date: 2025-06-26 16:16:38
 * @LastEditors: shen
 * @LastEditTime: 2025-06-27 09:30:45
 * @Description:
-->
<script setup lang="ts">
defineOptions({
  name: 'AuthenticationContent',
})

interface Props {
  align?: 'left' | 'center' | 'right'
}

withDefaults(defineProps<Props>(), {
  align: 'right',
})
</script>

<template>
  <div class="authentication-content" :class="`authentication-content--${align}`">
    <slot></slot>
    <!-- Router View with Transition and KeepAlive -->
    <RouterView v-slot="{ Component, route }">
      <Transition appear mode="out-in" name="slide-right">
        <KeepAlive :include="['Login']">
          <component :is="Component" :key="route.fullPath" class="authentication-content-page" />
        </KeepAlive>
      </Transition>
    </RouterView>

    <!-- Footer -->
    <div class="authentication-content-footer">
      <slot name="footer"> </slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.authentication-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background-color: hsl(var(--pro-background));

  &:where(.dark, .dark *) {
    background-color: hsl(var(--pro-background-deep));
  }

  &--center {
    width: 100%;
    padding-bottom: 80px;
    border-radius: 24px;
    box-shadow:
      0 6px 16px 0 hsl(212deg 100% 45% / 5%),
      0 3px 6px -4px hsl(212deg 100% 45% / 5%),
      0 9px 28px 8px hsl(212deg 100% 45% / 5%);

    @media (min-width: 768px) {
      & {
        width: 66.6667%;
        background-color: hsl(var(--pro-background));
      }
    }

    @media (min-width: 1024px) {
      & {
        width: 50%;
      }
    }

    @media (min-width: 1280px) {
      & {
        width: 36%;
      }
    }
  }

  &--left,
  &--right {
    flex: 1 1 0%;
    width: 34%;
    min-height: 100%;
  }

  &-page {
    width: 100%;
    margin-top: 24px;

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

  &-footer {
    position: absolute;
    bottom: 12px;
    display: flex;
    font-size: 12px;
    line-height: 16px;
    color: hsl(var(--pro-muted-foreground));
    text-align: center;
  }

  @media (min-width: 1024px) {
    & {
      padding-right: 32px;
      padding-left: 32px;

      &--left,
      &--right {
        flex: 0 1 auto;
      }
    }
  }
}
</style>
