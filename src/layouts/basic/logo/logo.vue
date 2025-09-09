<!--
 * @Author: shen
 * @Date: 2025-06-16 13:26:32
 * @LastEditors: shen
 * @LastEditTime: 2025-09-09 09:17:08
 * @Description:
-->
<script setup lang="ts">
import { Avatar } from 'ant-design-vue'

interface Props {
  /**
   * @zh_CN 是否收起文本
   */
  collapsed?: boolean
  /**
   * @zh_CN Logo 跳转地址
   */
  href?: string
  /**
   * @zh_CN Logo 图片大小
   */
  logoSize?: number
  /**
   * @zh_CN Logo 图标
   */
  src?: string
  /**
   * @zh_CN Logo 文本
   */
  text: string
  /**
   * @zh_CN Logo 主题
   */
  theme?: string
}

defineOptions({
  name: 'Logo',
})

withDefaults(defineProps<Props>(), {
  collapsed: false,
  href: 'javascript:void 0',
  logoSize: 32,
  src: '',
  theme: 'light',
})
</script>

<template>
  <div :class="theme" class="layout-logo">
    <a :class="$attrs.class" :href="href" class="layout-logo-link">
      <Avatar v-if="src" :alt="text" :src="src" :size="logoSize" class="layout-logo-avatar" />
      <template v-if="!collapsed">
        <slot name="text">
          <span class="layout-logo-text">
            {{ text }}
          </span>
        </slot>
      </template>
    </a>
  </div>
</template>

<style lang="less" scoped>
.layout-logo {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 18px;
  line-height: 28px;

  &-link {
    display: flex;
    gap: 8px;
    align-items: center;
    height: 100%;
    padding-right: 12px;
    padding-left: 12px;
    overflow: hidden;
    font-size: 18px;
    line-height: 1.5;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 500ms;
    transition-property: all;
    animation-duration: 500ms;
  }

  &-avatar {
    position: relative;
    flex-shrink: 0;
    background-color: transparent;
    border-radius: 0;
  }

  &-text {
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
    color: hsl(var(--pro-foreground));
    text-wrap: nowrap;
    white-space: nowrap;
  }
}
</style>
