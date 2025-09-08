<script lang="ts" setup>
import { computed, useSlots, h } from 'vue'
import { Button } from 'ant-design-vue'
import { useRefresh } from '@/hooks'
import { RotateCwIcon } from '@/icons'
import { preferences, usePreferences } from '@/shared/preferences'
import { useAuthStore } from '@/stores'

import {
  FullScreen,
  GlobalSearch,
  LanguageToggle,
  PreferencesButton,
  ThemeToggle,
} from '../../widgets'

interface Props {
  /**
   * Logo 主题
   */
  theme?: string
}

defineOptions({
  name: 'LayoutHeader',
})

withDefaults(defineProps<Props>(), {
  theme: 'light',
})

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>()

const REFERENCE_VALUE = 50

const { globalSearchShortcutKey, preferencesButtonPosition } = usePreferences()
const slots = useSlots()
const { refresh } = useRefresh()
const authStore = useAuthStore()
const rightSlots = computed(() => {
  const list = [{ index: REFERENCE_VALUE + 100, name: 'user-dropdown' }]
  if (preferences.widget.globalSearch) {
    list.push({
      index: REFERENCE_VALUE,
      name: 'global-search',
    })
  }

  if (preferencesButtonPosition.value.header) {
    list.push({
      index: REFERENCE_VALUE + 10,
      name: 'preferences',
    })
  }
  if (preferences.widget.themeToggle) {
    list.push({
      index: REFERENCE_VALUE + 20,
      name: 'theme-toggle',
    })
  }
  if (preferences.widget.languageToggle) {
    list.push({
      index: REFERENCE_VALUE + 30,
      name: 'language-toggle',
    })
  }
  if (preferences.widget.fullscreen) {
    list.push({
      index: REFERENCE_VALUE + 40,
      name: 'fullscreen',
    })
  }
  if (preferences.widget.notification) {
    list.push({
      index: REFERENCE_VALUE + 50,
      name: 'notification',
    })
  }

  Object.keys(slots).forEach((key) => {
    const name = key.split('-')
    if (key.startsWith('header-right')) {
      list.push({ index: Number(name[2]), name: key })
    }
  })
  return list.sort((a, b) => a.index - b.index)
})

const leftSlots = computed(() => {
  const list: Array<{ index: number; name: string }> = []

  if (preferences.widget.refresh) {
    list.push({
      index: 0,
      name: 'refresh',
    })
  }

  Object.keys(slots).forEach((key) => {
    const name = key.split('-')
    if (key.startsWith('header-left')) {
      list.push({ index: Number(name[2]), name: key })
    }
  })
  return list.sort((a, b) => a.index - b.index)
})

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout')
}
</script>

<template>
  <template
    v-for="slot in leftSlots.filter((item) => item.index < REFERENCE_VALUE)"
    :key="slot.name"
  >
    <slot :name="slot.name">
      <template v-if="slot.name === 'refresh'">
        <Button
          type="text"
          shape="circle"
          style="
            display: block;
            margin-right: 4px;
            font-size: 16px;
            color: hsl(var(--pro-foreground));
          "
          :icon="h(RotateCwIcon)"
          @click="refresh"
        >
        </Button>
      </template>
    </slot>
  </template>
  <div class="layout-header-breadcrumb">
    <slot name="breadcrumb"></slot>
  </div>
  <template
    v-for="slot in leftSlots.filter((item) => item.index > REFERENCE_VALUE)"
    :key="slot.name"
  >
    <slot :name="slot.name"></slot>
  </template>
  <div :class="['layout-header-menu', `layout-header-menu--${preferences.header.menuAlign}`]">
    <slot name="menu"></slot>
  </div>
  <div class="layout-header-actions">
    <template v-for="slot in rightSlots" :key="slot.name">
      <slot :name="slot.name">
        <template v-if="slot.name === 'global-search'">
          <GlobalSearch
            class="layout-header-actions-item layout-header-search"
            :enable-shortcut-key="globalSearchShortcutKey"
            :menus="authStore.accessMenus"
          />
          <!-- :menus="authStore.originMenus as any" -->
        </template>

        <template v-else-if="slot.name === 'preferences'">
          <PreferencesButton
            class="layout-header-actions-item"
            @clear-preferences-and-logout="clearPreferencesAndLogout"
          />
        </template>
        <template v-else-if="slot.name === 'theme-toggle'">
          <ThemeToggle class="layout-header-actions-item" />
        </template>
        <template v-else-if="slot.name === 'language-toggle'">
          <LanguageToggle class="layout-header-actions-item" />
        </template>
        <template v-else-if="slot.name === 'fullscreen'">
          <FullScreen class="layout-header-actions-item" />
        </template>
      </slot>
    </template>
  </div>
</template>
<style lang="less" scoped>
.layout-header {
  &-breadcrumb {
    // align-items: center;
    // justify-content: center;
    display: none;
  }

  &-menu {
    display: flex;
    flex: 1 1 0%;
    align-items: center;
    min-width: 0;
    height: 100%;

    &--start {
      justify-content: start;
    }

    &--center {
      justify-content: center;
    }

    &--end {
      justify-content: end;
    }
  }

  &-actions {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    min-width: 0;
    height: 100%;
    padding-left: 10px;

    &-item {
      margin-right: 4px;
    }
  }

  @media (min-width: 1024px) {
    &-breadcrumb {
      display: block !important;
    }
  }

  @media (min-width: 640px) {
    &-search {
      margin-right: 16px !important;
    }
  }
}

.menu-align-start {
  --menu-align: start;
}

.menu-align-center {
  --menu-align: center;
}

.menu-align-end {
  --menu-align: end;
}
</style>
