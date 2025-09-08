<script setup lang="ts">
import type { BuiltinThemePreset } from '@/shared/preferences'
import type { BuiltinThemeType } from '@/typings'

import { computed, ref, watch } from 'vue'

import { UserRoundPenIcon } from '@/icons'
import { $t } from '@/shared/locales'
import { BUILT_IN_THEME_PRESETS } from '@/shared/preferences'
import { convertToHsl, TinyColor } from '@/shared/color'

import { useThrottleFn } from '@vueuse/core'

defineOptions({
  name: 'PreferenceBuiltinTheme',
})

const props = defineProps<{ isDark: boolean }>()

const colorInput = ref()
const modelValue = defineModel<BuiltinThemeType>({ default: 'default' })
const themeColorPrimary = defineModel<string>('themeColorPrimary')

const updateThemeColorPrimary = useThrottleFn(
  (value: string) => {
    themeColorPrimary.value = value
  },
  300,
  true,
  true,
)

const inputValue = computed(() => {
  return new TinyColor(themeColorPrimary.value || '').toHexString()
})

const builtinThemePresets = computed(() => {
  return [...BUILT_IN_THEME_PRESETS]
})

function typeView(name: BuiltinThemeType) {
  switch (name) {
    case 'custom': {
      return $t('preferences.theme.builtin.custom')
    }
    case 'deep-blue': {
      return $t('preferences.theme.builtin.deepBlue')
    }
    case 'deep-green': {
      return $t('preferences.theme.builtin.deepGreen')
    }
    case 'default': {
      return $t('preferences.theme.builtin.default')
    }
    case 'gray': {
      return $t('preferences.theme.builtin.gray')
    }
    case 'green': {
      return $t('preferences.theme.builtin.green')
    }

    case 'neutral': {
      return $t('preferences.theme.builtin.neutral')
    }
    case 'orange': {
      return $t('preferences.theme.builtin.orange')
    }
    case 'pink': {
      return $t('preferences.theme.builtin.pink')
    }
    case 'rose': {
      return $t('preferences.theme.builtin.rose')
    }
    case 'sky-blue': {
      return $t('preferences.theme.builtin.skyBlue')
    }
    case 'slate': {
      return $t('preferences.theme.builtin.slate')
    }
    case 'violet': {
      return $t('preferences.theme.builtin.violet')
    }
    case 'yellow': {
      return $t('preferences.theme.builtin.yellow')
    }
    case 'zinc': {
      return $t('preferences.theme.builtin.zinc')
    }
  }
}

function handleSelect(theme: BuiltinThemePreset) {
  modelValue.value = theme.type
}

function handleInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  updateThemeColorPrimary(convertToHsl(target.value))
}

function selectColor() {
  colorInput.value?.[0]?.click?.()
}

watch(
  () => [modelValue.value, props.isDark] as [BuiltinThemeType, boolean],
  ([themeType, isDark]) => {
    const theme = builtinThemePresets.value.find((item) => item.type === themeType)
    if (theme) {
      const primaryColor = isDark
        ? theme.darkPrimaryColor || theme.primaryColor
        : theme.primaryColor

      themeColorPrimary.value = primaryColor || theme.color
    }
  },
)
</script>

<template>
  <div class="preferences-builtin-theme">
    <template v-for="theme in builtinThemePresets" :key="theme.type">
      <div class="preferences-builtin-theme-col" @click="handleSelect(theme)">
        <div
          :class="{
            'outline-box-active': theme.type === modelValue,
          }"
          class="preferences-builtin-theme-box outline-box"
        >
          <template v-if="theme.type !== 'custom'">
            <div
              :style="{ backgroundColor: theme.color }"
              class="preferences-builtin-theme-color"
            ></div>
          </template>
          <template v-else>
            <div class="preferences-builtin-theme-custom" @click.stop="selectColor">
              <div class="preferences-builtin-theme-custom-wrap">
                <UserRoundPenIcon class="preferences-builtin-theme-custom-icon" />
                <input
                  ref="colorInput"
                  :value="inputValue"
                  class="preferences-builtin-theme-custom-input"
                  type="color"
                  @input="handleInputChange"
                />
              </div>
            </div>
          </template>
        </div>
        <div class="preferences-builtin-theme-title">
          {{ typeView(theme.type) }}
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.preferences-builtin-theme {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;

  &-col {
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }

  &-box {
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      .preferences-builtin-theme-custom-icon {
        opacity: 1;
      }
    }
  }

  &-color {
    width: 20px;
    height: 20px;
    margin: 8px 40px;
    border-radius: calc(var(--pro-radius) - 2px);
  }

  &-title {
    margin: 8px 0;
    font-size: 12px;
    line-height: 16px;
    color: hsl(var(--pro-muted-foreground));
    text-align: center;
  }

  &-custom {
    width: 100%;
    height: 100%;
    padding: 8px 40px;

    &-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: calc(var(--pro-radius) - 4px);
    }

    &-input {
      position: absolute;
      inset: 0;
      opacity: 0;
    }

    &-icon {
      position: absolute;
      z-index: 10;
      font-size: 20px;
      opacity: 0.6;
    }
  }
}
</style>
