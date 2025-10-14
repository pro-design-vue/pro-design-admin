<script setup lang="ts">
import type { MenuRecordRaw } from '@/typings'

import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon, MdiKeyboardEsc, SearchIcon } from '@/icons'
import { $t } from '@/shared/locales'
import { isWindowsOs } from '@/shared/utils'
import { ProModal } from 'pro-design-vue'
import { Modal } from 'ant-design-vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import SearchPanel from './search-panel.vue'

defineOptions({
  name: 'GlobalSearch',
})

const props = withDefaults(
  defineProps<{ enableShortcutKey?: boolean; menus?: MenuRecordRaw[] }>(),
  {
    enableShortcutKey: true,
    menus: () => [],
  },
)

const open = ref(false)
const keyword = ref('')
const searchInputRef = ref<HTMLInputElement>()

function handleClose() {
  open.value = false
  keyword.value = ''
}

const keys = useMagicKeys()
const cmd = isWindowsOs() ? keys['ctrl+k'] : keys['cmd+k']
whenever(cmd!, () => {
  if (props.enableShortcutKey) {
    open.value = true
  }
})

whenever(open, () => {
  nextTick(() => {
    searchInputRef.value?.focus()
  })
})

const preventDefaultBrowserSearchHotKey = (event: KeyboardEvent) => {
  if (event.key?.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
  }
}

const toggleKeydownListener = () => {
  if (props.enableShortcutKey) {
    window.addEventListener('keydown', preventDefaultBrowserSearchHotKey)
  } else {
    window.removeEventListener('keydown', preventDefaultBrowserSearchHotKey)
  }
}

const toggleOpen = () => {
  open.value ? (open.value = false) : (open.value = true)
}

watch(() => props.enableShortcutKey, toggleKeydownListener)

onMounted(() => {
  toggleKeydownListener()

  onUnmounted(() => {
    window.removeEventListener('keydown', preventDefaultBrowserSearchHotKey)
  })
})
</script>

<template>
  <div>
    <ProModal
      v-model:open="open"
      :width="600"
      :destroy-on-close="false"
      class="global-search-modal"
      draggable
      @cancel="handleClose"
    >
      <template #title>
        <div class="global-search-header">
          <div class="global-search-header-wrapper">
            <SearchIcon class="global-search-header-icon" />
            <input
              ref="searchInputRef"
              v-model="keyword"
              :placeholder="$t('ui.widgets.search.searchNavigate')"
              class="global-search-header-input"
            />
          </div>
        </div>
      </template>

      <SearchPanel :keyword="keyword" :menus="menus" @close="handleClose" />
      <template #footer>
        <div class="global-search-footer">
          <div>
            <CornerDownLeftIcon class="global-search-footer-icon" />
            {{ $t('ui.widgets.search.select') }}
          </div>
          <div>
            <ArrowUpIcon class="global-search-footer-icon" />
            <ArrowDownIcon class="global-search-footer-icon" />
            {{ $t('ui.widgets.search.navigate') }}
          </div>
          <div>
            <MdiKeyboardEsc class="global-search-footer-icon" />
            {{ $t('ui.widgets.search.close') }}
          </div>
        </div>
      </template>
    </ProModal>
    <div class="global-search-trigger" @click="toggleOpen()">
      <SearchIcon disabled style="font-size: 16px" />
      <span class="global-search-trigger-text">
        {{ $t('ui.widgets.search.title') }}
      </span>
      <span v-if="enableShortcutKey" class="global-search-trigger-shortcut">
        {{ isWindowsOs() ? 'Ctrl' : '⌘' }}
        <kbd>K</kbd>
      </span>
      <span v-else></span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.global-search {
  &-header {
    display: flex;
    row-gap: 6px;
    width: 100%;
    font-weight: 600;
    line-height: 1;
    text-align: center;
    letter-spacing: -0.45px;

    &-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
    }

    &-icon {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      color: hsl(var(--pro-muted-foreground));
    }

    &-input {
      width: 80%;
      padding: 8px;
      padding-left: 0;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      outline: 2px solid transparent;
      outline-offset: 2px;
      background-color: transparent;
      border-style: none;
      border-width: 1px;
      border-radius: calc(var(--pro-radius) - 2px);

      &::placeholder {
        color: hsl(var(--pro-muted-foreground));
      }
    }
  }

  &-footer {
    display: flex;
    column-gap: 8px;
    justify-content: flex-start;
    width: 100%;
    font-size: 12px;
    line-height: 16px;

    & > div {
      display: flex;
      align-items: center;
      margin-right: 8px;
    }

    &-icon {
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }
  }

  &-trigger {
    display: flex;
    gap: 12px;
    align-items: center;
    height: 32px;
    padding: 2px 8px;
    color: hsl(var(--pro-muted-foreground));
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: 2px;
    background-color: hsl(var(--pro-accent));
    background-image: none;
    border-style: none;
    border-radius: 16px;

    &:hover {
      color: hsl(var(--pro-foreground));
    }

    &-text {
      display: none;
      font-size: 12px;
      line-height: 16px;
      transition-duration: 300ms;
      animation-duration: 300ms;
    }

    &-shortcut {
      position: relative;
      display: none;
      padding: 4px 6px;
      font-size: 12px;
      line-height: 1;
      background-color: hsl(var(--pro-background));
      border-color: hsl(var(--pro-foreground) / 60%);
      border-radius: calc(var(--pro-radius) - 4px);
      border-top-right-radius: calc(var(--pro-radius) + 4px);
      border-bottom-right-radius: calc(var(--pro-radius) + 4px);
    }

    @media (min-width: 768px) {
      &-text,
      &-shortcut {
        display: block !important;
      }
    }
  }

  @media (min-width: 640px) {
    &-header {
      text-align: left !important;
    }
  }
}
</style>

<style lang="less">
.global-search-modal {
  .pro-ant-modal-content {
    padding: 0;
  }
}
</style>
