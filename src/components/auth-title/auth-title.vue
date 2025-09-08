<!--
 * @Author: shen
 * @Date: 2025-06-27 14:03:06
 * @LastEditors: shen
 * @LastEditTime: 2025-06-27 14:11:12
 * @Description:
-->
<template>
  <div class="auth-title">
    <h2 class="auth-title-main">
      <slot></slot>
    </h2>

    <p class="auth-title-sub">
      <slot name="desc"></slot>
    </p>
  </div>
</template>

<style lang="less" scoped>
.auth-title {
  margin-bottom: 28px;

  &-main {
    margin-bottom: 12px;
    font-weight: 700;
    line-height: 36px;
    color: hsl(var(--pro-foreground));
    letter-spacing: -0.025em;

    @media (min-width: 1024px) {
      & {
        font-size: 36px;
        line-height: 40px;
      }
    }
  }

  &-sub {
    font-size: 14px;
    line-height: 20px;
    color: hsl(var(--pro-muted-foreground));
  }

  @media (min-width: 640px) {
    & {
      max-width: 448px;
      margin-right: auto;
      margin-left: auto;
    }
  }
}
</style>
