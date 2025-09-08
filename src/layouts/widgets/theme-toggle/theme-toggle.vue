<script lang="ts" setup>
import { updatePreferences, usePreferences } from '@/shared/preferences'
import ThemeButton from './theme-button.vue'

defineOptions({
  name: 'ThemeToggle',
})

function handleChange(isDark: boolean | undefined) {
  updatePreferences({
    theme: { mode: isDark ? 'dark' : 'light' },
  })
}

const { isDark } = usePreferences()
</script>
<template>
  <div>
    <ThemeButton :model-value="isDark" @update:model-value="handleChange" />
  </div>
</template>
