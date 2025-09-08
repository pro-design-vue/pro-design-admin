<script setup lang="ts">
import type { ProFallbackProps } from './typing'

import { computed, defineAsyncComponent } from 'vue'
import { ArrowLeftOutlined, RedoOutlined } from '@ant-design/icons-vue'
import { $t } from '@/shared/locales'
import { usePrefixCls } from '@/hooks'
import { Button } from 'ant-design-vue'

interface Props extends ProFallbackProps {}

defineOptions({
  name: 'ProFallback',
})

const props = withDefaults(defineProps<Props>(), {
  description: '',
  image: '',
  showBackBtn: true,
  showRefreshBtn: false,
  status: 'coming-soon',
  title: '',
})

const emit = defineEmits<{ back: [e: Event]; refresh: [e: Event] }>()

const prefixCls = usePrefixCls('fallback')
const Icon403 = defineAsyncComponent(() => import('./icons/icon-403.vue'))
const Icon404 = defineAsyncComponent(() => import('./icons/icon-404.vue'))
const Icon500 = defineAsyncComponent(() => import('./icons/icon-500.vue'))
const IconHello = defineAsyncComponent(() => import('./icons/icon-coming-soon.vue'))
const IconOffline = defineAsyncComponent(() => import('./icons/icon-offline.vue'))

const titleText = computed(() => {
  if (props.title) {
    return props.title
  }

  switch (props.status) {
    case '403': {
      return $t('ui.fallback.forbidden')
    }
    case '404': {
      return $t('ui.fallback.pageNotFound')
    }
    case '500': {
      return $t('ui.fallback.internalError')
    }
    case 'coming-soon': {
      return $t('ui.fallback.comingSoon')
    }
    case 'offline': {
      return $t('ui.fallback.offlineError')
    }
    default: {
      return ''
    }
  }
})

const descText = computed(() => {
  if (props.description) {
    return props.description
  }
  switch (props.status) {
    case '403': {
      return $t('ui.fallback.forbiddenDesc')
    }
    case '404': {
      return $t('ui.fallback.pageNotFoundDesc')
    }
    case '500': {
      return $t('ui.fallback.internalErrorDesc')
    }
    case 'offline': {
      return $t('ui.fallback.offlineErrorDesc')
    }
    default: {
      return ''
    }
  }
})

const fallbackIcon = computed(() => {
  switch (props.status) {
    case '403': {
      return Icon403
    }
    case '404': {
      return Icon404
    }
    case '500': {
      return Icon500
    }
    case 'coming-soon': {
      return IconHello
    }
    case 'offline': {
      return IconOffline
    }
    default: {
      return null
    }
  }
})

const showBack = computed(() => {
  return (props.status === '403' || props.status === '404') && props.showBackBtn
})

const showRefresh = computed(() => {
  return (props.status === '500' || props.status === 'offline') && props.showRefreshBtn
})

// 返回首页
function backHome(e: Event) {
  emit('back', e)
}

function refresh(e: Event) {
  location.reload()
  emit('refresh', e)
}
</script>

<template>
  <div :class="prefixCls">
    <img v-if="image" :src="image" :class="`${prefixCls}-img`" />
    <component :is="fallbackIcon" v-else-if="fallbackIcon" :class="`${prefixCls}-icon`" />
    <div :class="`${prefixCls}-wrap`">
      <slot v-if="$slots.title" name="title"></slot>
      <p v-else-if="titleText" :class="`${prefixCls}-title`">
        {{ titleText }}
      </p>
      <slot v-if="$slots.describe" name="describe"></slot>
      <p v-else-if="descText" :class="`${prefixCls}-desc`">
        {{ descText }}
      </p>
      <slot v-if="$slots.action" name="action"></slot>
      <Button
        v-else-if="showBack"
        type="primary"
        size="large"
        style="margin-right: 8px"
        @click="backHome"
      >
        <template #icon>
          <ArrowLeftOutlined />
        </template>
        {{ $t('common.backToHome') }}
      </Button>
      <Button
        v-else-if="showRefresh"
        type="primary"
        size="large"
        style="margin-right: 8px"
        @click="refresh"
      >
        <template #icon>
          <RedoOutlined />
        </template>
        {{ $t('common.refresh') }}
      </Button>
    </div>
  </div>
</template>
