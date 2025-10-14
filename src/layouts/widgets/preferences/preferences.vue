<!--
 * @Author: shen
 * @Date: 2025-06-17 09:55:09
 * @LastEditors: shen
 * @LastEditTime: 2025-10-13 10:08:31
 * @Description:
-->
<script lang="ts" setup>
import { computed, h, ref } from 'vue'

import { SettingsIcon } from '@/icons'
import { $t, loadLocaleMessages } from '@/shared/locales'
import { preferences, updatePreferences } from '@/shared/preferences'
import { capitalizeFirstLetter } from '@/shared/utils'

import { Button } from 'ant-design-vue'
import PreferencesDrawer from './preferences-drawer.vue'

const open = ref(false)
/**
 * preferences 转成 vue props
 * preferences.widget.fullscreen=>widgetFullscreen
 */
const attrs = computed(() => {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(preferences)) {
    for (const [subKey, subValue] of Object.entries(value)) {
      result[`${key}${capitalizeFirstLetter(subKey)}`] = subValue
    }
  }
  return result
})

/**
 * preferences 转成 vue listener
 * preferences.widget.fullscreen=>@update:widgetFullscreen
 */
const listen = computed(() => {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(preferences)) {
    if (typeof value === 'object') {
      for (const subKey of Object.keys(value)) {
        result[`update:${key}${capitalizeFirstLetter(subKey)}`] = (val: any) => {
          updatePreferences({ [key]: { [subKey]: val } })
          if (key === 'app' && subKey === 'locale') {
            loadLocaleMessages(val)
          }
        }
      }
    } else {
      result[key] = value
    }
  }
  return result
})
</script>
<template>
  <div>
    <PreferencesDrawer v-model:open="open" v-bind="{ ...$attrs, ...attrs }" v-on="listen" />
    <div @click="open = true">
      <slot>
        <Button
          :title="$t('preferences.title')"
          type="primary"
          size="large"
          style="font-size: 20px; border-top-right-radius: 0; border-bottom-right-radius: 0"
          :icon="h(SettingsIcon)"
        >
        </Button>
      </slot>
    </div>
  </div>
</template>
