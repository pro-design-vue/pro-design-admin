<!--
 * @Author: shen
 * @Date: 2025-06-26 15:03:09
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 15:51:01
 * @Description:
-->
<script setup lang="ts">
import type { BuiltinThemeType } from '@/typings'

import { PaletteIcon } from '@/icons'
import { COLOR_PRESETS, preferences, updatePreferences } from '@/shared/preferences'

import { ProButton } from 'pro-design-vue'

defineOptions({
  name: 'AuthenticationColorToggle',
})

function handleUpdate(colorPrimary: string, type: BuiltinThemeType) {
  updatePreferences({
    theme: {
      colorPrimary,
      builtinType: type,
    },
  })
}
</script>

<template>
  <div class="color-toggle">
    <div class="color-toggle-wrap">
      <template v-for="preset in COLOR_PRESETS" :key="preset.color">
        <ProButton
          shape="circle"
          type="text"
          class="color-toggle-item"
          @click="handleUpdate(preset.color, preset.type)"
        >
          <div :style="{ backgroundColor: preset.color }" class="color-toggle-item-wrap">
            <svg
              v-if="preferences.theme.builtinType === preset.type"
              class="color-toggle-item-checked"
              height="1em"
              viewBox="0 0 15 15"
              width="1em"
            >
              <path
                clip-rule="evenodd"
                d="M11.467 3.727c.289.189.37.576.181.865l-4.25 6.5a.625.625 0 0 1-.944.12l-2.75-2.5a.625.625 0 0 1 .841-.925l2.208 2.007l3.849-5.886a.625.625 0 0 1 .865-.181"
                fill="currentColor"
                fill-rule="evenodd"
              />
            </svg>
          </div>
        </ProButton>
      </template>
    </div>

    <ProButton
      shape="circle"
      type="text"
      class="color-toggle-btn"
      style="font-size: 16px; color: hsl(var(--pro-primary))"
    >
      <template #icon>
        <PaletteIcon />
      </template>
    </ProButton>
  </div>
</template>

<style lang="less" scoped>
.color-toggle {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;

  &:hover {
    .color-toggle-wrap {
      width: 240px;
    }
  }

  &-wrap {
    display: flex;
    width: 0;
    overflow: hidden;
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transition-duration: 500ms;
    transition-property: all;
  }

  &-item {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    &-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 9999px;

      &:hover {
        transform: scale(1.1);
      }
    }

    &-checked {
      width: 14px;
      height: 14px;
      color: #fff;
    }
  }
}
</style>
