<script lang="ts" setup>
import type { NotificationItem } from './types'

import { BellIcon, MailCheckIcon } from '@/icons'
import { $t } from '@/shared/locales'

import { Popover, Avatar } from 'ant-design-vue'
import { ProButton } from 'pro-design-vue'
import { useToggle } from '@vueuse/core'

interface Props {
  /**
   * 显示圆点
   */
  dot?: boolean
  /**
   * 消息列表
   */
  notifications?: NotificationItem[]
}

defineOptions({ name: 'NotificationPopup' })

withDefaults(defineProps<Props>(), {
  dot: false,
  notifications: () => [],
})

const emit = defineEmits<{
  clear: []
  makeAll: []
  read: [NotificationItem]
  viewAll: []
}>()

const [open, toggle] = useToggle()

function close() {
  open.value = false
}

function handleViewAll() {
  emit('viewAll')
  close()
}

function handleMakeAll() {
  emit('makeAll')
}

function handleClear() {
  emit('clear')
}

function handleClick(item: NotificationItem) {
  emit('read', item)
}
</script>
<template>
  <Popover
    :trigger="['click']"
    :overlayInnerStyle="{ padding: 0 }"
    :arrow="false"
    placement="bottomRight"
    overlayClassName="notify"
  >
    <div class="notify-trigger" @click.stop="toggle()">
      <ProButton shape="circle" type="text" class="notify-trigger-btn">
        <span v-if="dot" class="notify-trigger-dot"></span>
        <template #icon><BellIcon class="size-4" /></template>
      </ProButton>
    </div>
    <template #content>
      <div class="notify-wrapper">
        <div class="notify-header">
          <div class="notify-header-title">{{ $t('ui.widgets.notifications') }}</div>
          <ProButton
            shape="circle"
            type="text"
            :disabled="notifications.length <= 0"
            style="font-size: 16px"
            :tooltip="$t('ui.widgets.markAllAsRead')"
            @click="handleMakeAll"
          >
            <template #icon><MailCheckIcon /></template>
          </ProButton>
        </div>
        <div class="notify-content" v-if="notifications.length > 0">
          <div class="notify-scroll">
            <ul class="notify-list">
              <template v-for="item in notifications" :key="item.title">
                <li class="notify-list-item" @click="handleClick(item)">
                  <span v-if="!item.isRead" class="notify-list-item-read"></span>

                  <span class="notify-list-item-img">
                    <Avatar
                      :src="item.avatar"
                      :size="40"
                      class="aspect-square h-full w-full object-cover"
                      role="img"
                    />
                  </span>
                  <div class="notify-list-item-wrap">
                    <p class="notify-list-item-title">{{ item.title }}</p>
                    <p class="notify-list-item-message">
                      {{ item.message }}
                    </p>
                    <p class="notify-list-item-date">
                      {{ item.date }}
                    </p>
                  </div>
                </li>
              </template>
            </ul>
          </div>
        </div>

        <template v-else>
          <div class="notify-empty">
            <span>{{ $t('common.noData') }}</span>
          </div>
        </template>

        <div class="notify-bottom">
          <ProButton
            size="small"
            type="text"
            :disabled="notifications.length <= 0"
            @click="handleClear"
          >
            {{ $t('ui.widgets.clearNotifications') }}
          </ProButton>
          <ProButton size="small" type="primary" @click="handleViewAll">
            {{ $t('ui.widgets.viewAll') }}
          </ProButton>
        </div>
      </div>
    </template>
  </Popover>
</template>

<style lang="less" scoped>
.notify {
  &-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-right: 8px;

    &-dot {
      position: absolute;
      top: 2px;
      right: 0;
      width: 8px;
      height: 8px;
      background-color: hsl(var(--pro-primary));
      border-radius: 4px;
    }

    &-btn {
      position: relative;
      font-size: 16px;
      color: hsl(var(--pro-foreground));

      &:hover {
        svg {
          animation: bell-ring 1s both;
        }
      }
    }
  }

  &-wrapper {
    position: relative;
    width: 360px;
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;

    &-title {
      font-size: 16px;
      color: hsl(var(--pro-foreground));
    }
  }

  &-content {
    position: relative;
    overflow: hidden;
  }

  &-scroll {
    width: 100%;
    height: 100%;
    overflow: hidden scroll;
    border-radius: inherit;
  }

  &-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 360px;

    &-item {
      position: relative;
      display: flex;
      gap: 20px;
      align-items: flex-start;
      width: 100%;
      padding: 12px;
      cursor: pointer;
      border-top-width: 1px;

      &:hover {
        background-color: hsl(var(--pro-accent));
      }

      &-read {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 8px;
        height: 8px;
        background-color: hsl(var(--pro-primary));
        border-radius: 4px;
      }

      &-img {
        position: relative;
        display: flex;
        flex-shrink: 0;
        overflow: hidden;
      }

      &-wrap {
        display: flex;
        flex-direction: column;
        gap: 4px;
        line-height: 1;
      }

      &-title {
        font-size: 16px;
        font-weight: 600;
        color: hsl(var(--pro-foreground));
      }

      &-message {
        display: flex;
        margin-top: 4px;
        margin-bottom: 4px;
        overflow: hidden;
        line-clamp: 2;
        font-size: 12px;
        line-height: 16px;
        color: hsl(var(--pro-muted-foreground));
        -webkit-box-orient: vertical;
      }

      &-date {
        display: flex;
        overflow: hidden;
        line-clamp: 2;
        font-size: 12px;
        line-height: 16px;
        color: hsl(var(--pro-muted-foreground));
        -webkit-box-orient: vertical;
      }
    }
  }

  &-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 150px;
    color: hsl(var(--pro-muted-foreground));
  }

  &-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-color: hsl(var(--pro-border));
    border-top-width: 1px;
  }
}

@keyframes bell-ring {
  0%,
  100% {
    transform-origin: top;
  }

  15% {
    transform: rotateZ(10deg);
  }

  30% {
    transform: rotateZ(-10deg);
  }

  45% {
    transform: rotateZ(5deg);
  }

  60% {
    transform: rotateZ(-5deg);
  }

  75% {
    transform: rotateZ(2deg);
  }
}
</style>
