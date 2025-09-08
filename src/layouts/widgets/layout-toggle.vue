<!--
 * @Author: shen
 * @Date: 2025-06-26 15:24:41
 * @LastEditors: shen
 * @LastEditTime: 2025-09-02 15:51:07
 * @Description:
-->
<script setup lang="ts">
import type { AuthPageLayoutType } from '@/typings'
import { h } from 'vue'
import { InspectionPanelIcon, PanelLeftIcon, PanelRightIcon } from '@/icons'
import { $t } from '@/shared/locales'
import { preferences, updatePreferences, usePreferences } from '@/shared/preferences'
import { Dropdown, Menu } from 'ant-design-vue'
import { ProButton } from 'pro-design-vue'

defineOptions({
  name: 'AuthenticationLayoutToggle',
})

const menus = [
  {
    icon: h(PanelLeftIcon, {
      style: {
        fontSize: '16px',
      },
    }),
    label: $t('authentication.layout.alignLeft'),
    key: 'panel-left',
  },
  {
    icon: h(InspectionPanelIcon, {
      style: {
        fontSize: '16px',
      },
    }),
    label: $t('authentication.layout.center'),
    key: 'panel-center',
  },
  {
    icon: h(PanelRightIcon, {
      style: {
        fontSize: '16px',
      },
    }),
    label: $t('authentication.layout.alignRight'),
    key: 'panel-right',
  },
]
const { authPanelCenter, authPanelLeft, authPanelRight } = usePreferences()

function handleUpdate(e) {
  const value = e.key
  if (!value) return
  updatePreferences({
    app: {
      authPageLayout: value as AuthPageLayoutType,
    },
  })
}
</script>

<template>
  <Dropdown :trigger="['click']">
    <ProButton
      shape="circle"
      type="text"
      style="font-size: 16px; color: hsl(var(--pro-foreground))"
    >
      <template #icon>
        <PanelRightIcon v-if="authPanelRight" />
        <PanelLeftIcon v-if="authPanelLeft" />
        <InspectionPanelIcon v-if="authPanelCenter" />
      </template>
    </ProButton>
    <template #overlay>
      <Menu
        :items="menus"
        selectable
        :selected-keys="[preferences.app.authPageLayout]"
        @click="handleUpdate"
      />
    </template>
  </Dropdown>
</template>
