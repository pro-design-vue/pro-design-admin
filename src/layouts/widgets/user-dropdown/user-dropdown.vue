<script setup lang="ts">
import type { Component } from 'vue'
import type { MenuProps } from 'ant-design-vue'
import { computed, ref } from 'vue'
import { $t } from '@/shared/locales'
import { ProIcon } from '@/components/common'
import { preferences, usePreferences } from '@/shared/preferences'
import { isWindowsOs } from '@/shared/utils'
import { Popover, Avatar, Badge, Divider, Tag, Menu, MenuDivider, App } from 'ant-design-vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import { LockKeyholeIcon, LogOutIcon } from '@/icons'
import { LockScreenModal } from '../lock-screen'

interface Props {
  /**
   * 头像
   */
  avatar?: string
  /**
   * @zh_CN 描述
   */
  description?: string
  /**
   * 是否启用快捷键
   */
  enableShortcutKey?: boolean
  /**
   * 菜单数组
   */
  menus?: Array<{ icon?: Component; label: string; key: string }>

  /**
   * 标签文本
   */
  tagText?: string
  /**
   * 文本
   */
  text?: string
  /** 触发方式 */
  trigger?: 'click' | 'hover'
  /** hover触发时，延迟响应的时间 */
  hoverDelay?: number
}

defineOptions({
  name: 'UserDropdown',
})

const props = withDefaults(defineProps<Props>(), {
  avatar: '',
  description: '',
  enableShortcutKey: true,
  menus: () => [],
  showShortcutKey: true,
  tagText: '',
  text: '',
  trigger: 'click',
})

const emit = defineEmits<{
  logout: []
  menuClick: [key: string | number]
  lock: [password: string]
}>()
const { modal } = App.useApp()
const { globalLockScreenShortcutKey, globalLogoutShortcutKey } = usePreferences()
const visible = ref(false)
const openLockModal = ref(false)
const altView = computed(() => (isWindowsOs() ? 'Alt' : '⌥'))

const enableLogoutShortcutKey = computed(() => {
  return props.enableShortcutKey && globalLogoutShortcutKey.value
})

const enableLockScreenShortcutKey = computed(() => {
  return props.enableShortcutKey && globalLockScreenShortcutKey.value
})

const enableShortcutKey = computed(() => {
  return props.enableShortcutKey && preferences.shortcutKeys.enable
})

const handleMenuClcik: MenuProps['onClick'] = ({ key }) => {
  visible.value = false
  switch (key) {
    case 'lockScreen':
      handleOpenLock()
      break
    case 'logout':
      handleLogout()
      break
    default:
      emit('menuClick', key)
      break
  }
}

function handleOpenLock() {
  openLockModal.value = true
}

function handleSubmitLock(lockScreenPassword: string) {
  openLockModal.value = false
  emit('lock', lockScreenPassword)
}

const handleLogout = () => {
  modal.confirm({
    title: $t('common.prompt'),
    type: 'warning',
    content: $t('ui.widgets.logoutTip'),
    onOk() {
      emit('logout')
    },
    onCancel() {},
  })
}

if (enableShortcutKey.value) {
  const keys = useMagicKeys()
  whenever(keys['Alt+KeyQ']!, () => {
    if (enableLogoutShortcutKey.value) {
      handleLogout()
    }
  })

  whenever(keys['Alt+KeyL']!, () => {
    if (enableLockScreenShortcutKey.value) {
      handleOpenLock()
    }
  })
}
</script>

<template>
  <LockScreenModal
    v-if="preferences.widget.lockScreen"
    v-model:open-lock-modal="openLockModal"
    :avatar="avatar"
    :text="text"
    @submit="handleSubmitLock"
  />
  <Popover
    v-model:open="visible"
    :trigger="[props.trigger]"
    :overlayInnerStyle="{ padding: 0 }"
    :arrow="false"
    placement="bottomRight"
    overlayClassName="user-dropdown"
  >
    <div class="user-dropdown-trigger">
      <div class="user-dropdown-trigger-wrap">
        <Badge
          dot
          color="green"
          :offset="[-5, 26]"
          :numberStyle="{
            width: '10px',
            height: '10px',
            borderWidth: '1px',
            borderColor: 'hsl(var(--pro-background))',
          }"
        >
          <Avatar :alt="text" :src="avatar" :size="32" />
        </Badge>
      </div>
    </div>
    <template #content>
      <div class="user-dropdown-wrap">
        <div class="user-dropdown-info">
          <Badge
            dot
            color="green"
            :offset="[-8, 40]"
            :numberStyle="{
              width: '14px',
              height: '14px',
              borderWidth: '1px',
              borderColor: 'hsl(var(--pro-background))',
            }"
          >
            <Avatar :alt="text" :src="avatar" :size="48" />
          </Badge>
          <div class="user-dropdown-info-right">
            <div v-if="tagText || text || $slots.tagText" class="user-dropdown-info-text">
              {{ text }}
              <slot name="tagText">
                <Tag v-if="tagText" :bordered="false" color="success" style="margin-left: 4px">
                  {{ tagText }}
                </Tag>
              </slot>
            </div>
            <div class="user-dropdown-info-description">
              {{ description }}
            </div>
          </div>
        </div>
        <Divider style="margin: 4px 0" v-if="menus?.length" />
        <div class="user-dropdown-menu">
          <Menu :selectable="false" @click="handleMenuClcik">
            <Menu.Item v-for="menu in menus" :key="menu.key">
              <template #icon>
                <ProIcon :icon="menu.icon" style="font-size: 16px" />
              </template>
              {{ menu.label }}
            </Menu.Item>
            <MenuDivider />
            <Menu.Item key="lockScreen">
              <template #icon>
                <LockKeyholeIcon style="font-size: 16px" />
              </template>
              {{ $t('ui.widgets.lockScreen.title') }}
              <span class="user-dropdown-menu-shortcut">{{ altView }} L</span>
            </Menu.Item>
            <MenuDivider />
            <Menu.Item key="logout">
              <template #icon>
                <LogOutIcon style="font-size: 16px" />
              </template>
              {{ $t('common.logout') }}
              <span class="user-dropdown-menu-shortcut"> {{ altView }} Q</span>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </template>
  </Popover>
</template>

<style lang="less" scoped>
.user-dropdown {
  &-trigger {
    padding: 6px;
    margin-right: 8px;
    margin-left: 4px;
    cursor: pointer;
    border-radius: 9999px;

    &:hover {
      background-color: hsl(var(--pro-accent));
    }

    &-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      color: hsl(var(--pro-accent-foreground));
    }
  }

  &-wrap {
    width: 240px;
    color: hsl(var(--pro-popover-foreground));
  }

  &-info {
    display: flex;
    align-items: center;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;

    &-right {
      width: 100%;
      margin-left: 8px;
    }

    &-text {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: hsl(var(--pro-foreground));
    }

    &-description {
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      color: hsl(var(--pro-muted-foreground));
    }
  }

  &-menu {
    ::v-deep(.@{ant-prefix}-menu) {
      color: hsl(var(--pro-popover-foreground));

      &-item {
        display: flex;
        align-items: center;
      }
    }

    &-shortcut {
      position: absolute;
      top: 50%;
      right: 16px;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 1.2px;
      opacity: 0.6;
      transform: translateY(-50%);
    }
  }
}
</style>
