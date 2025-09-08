<!--
 * @Author: shen
 * @Date: 2025-06-17 11:22:48
 * @LastEditors: shen
 * @LastEditTime: 2025-07-26 20:43:58
 * @Description:
-->
<script setup lang="ts">
import type { SupportedLanguagesType } from '@/shared/locales'
import { SUPPORT_LANGUAGES } from '@/shared/constants'
import { LanguagesIcon } from '@/icons'
// import { loadLocaleMessages } from '@/shared/locales'
import { preferences, updatePreferences } from '@/shared/preferences'
import { Button, Dropdown, Menu } from 'ant-design-vue'
import { sleep } from '@/shared/utils'

defineOptions({
  name: 'LanguageToggle',
})

async function handleUpdate(e) {
  const value = e.key
  if (!value) return
  const locale = value as SupportedLanguagesType
  updatePreferences({
    app: {
      locale,
    },
  })
  // await loadLocaleMessages(locale)
  await sleep(300)
  window.location.reload()
}

const menuItems = SUPPORT_LANGUAGES.map((item) => ({ label: item.label, key: item.value }))
</script>

<template>
  <div>
    <Dropdown :trigger="['click']">
      <Button shape="circle" type="text" style="font-size: 16px; color: hsl(var(--pro-foreground))">
        <template #icon>
          <LanguagesIcon />
        </template>
      </Button>
      <template #overlay>
        <Menu
          selectable
          :selected-keys="[preferences.app.locale]"
          :items="menuItems"
          @click="handleUpdate"
        />
      </template>
    </Dropdown>
  </div>
</template>
