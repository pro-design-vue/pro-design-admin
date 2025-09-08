<script setup lang="ts">
import type { MenuRecordRaw } from '@/typings'

import { nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'

import { SearchXIcon, XIcon } from '@/icons'
import { $t } from '@/shared/locales'
import { mapTree, traverseTreeValues, uniqueByField } from '@/shared/utils'

import { ProIcon } from '@/components/common'
import { isHttpUrl } from '@/shared/utils'

import { onKeyStroke, useLocalStorage, useThrottleFn } from '@vueuse/core'

defineOptions({
  name: 'SearchPanel',
})

const props = withDefaults(defineProps<{ keyword?: string; menus?: MenuRecordRaw[] }>(), {
  keyword: '',
  menus: () => [],
})
const emit = defineEmits<{ close: [] }>()

const router = useRouter()
const searchHistory = useLocalStorage<MenuRecordRaw[]>(
  `__search-history-${location.hostname}__`,
  [],
)
const activeIndex = ref(-1)
const searchItems = shallowRef<MenuRecordRaw[]>([])
const searchResults = ref<MenuRecordRaw[]>([])

const handleSearch = useThrottleFn(search, 200)

// 搜索函数，用于根据搜索关键词查找匹配的菜单项
function search(searchKey: string) {
  // 去除搜索关键词的前后空格
  searchKey = searchKey.trim()

  // 如果搜索关键词为空，清空搜索结果并返回
  if (!searchKey) {
    searchResults.value = []
    return
  }

  // 使用搜索关键词创建正则表达式
  const reg = createSearchReg(searchKey)

  // 初始化结果数组
  const results: MenuRecordRaw[] = []

  // 遍历搜索项
  traverseTreeValues(searchItems.value, (item) => {
    // 如果菜单项的名称匹配正则表达式，将其添加到结果数组中
    if (reg.test(item.title?.toLowerCase())) {
      results.push(item)
    }
  })

  // 更新搜索结果
  searchResults.value = results

  // 如果有搜索结果，设置索引为 0
  if (results.length > 0) {
    activeIndex.value = 0
  }

  // 赋值索引为 0
  activeIndex.value = 0
}

// When the keyboard up and down keys move to an invisible place
// the scroll bar needs to scroll automatically
function scrollIntoView() {
  const element = document.querySelector(`[data-search-item="${activeIndex.value}"]`)

  if (element) {
    element.scrollIntoView({ block: 'nearest' })
  }
}

// enter keyboard event
async function handleEnter() {
  if (searchResults.value.length === 0) {
    return
  }
  const result = searchResults.value
  const index = activeIndex.value
  if (result.length === 0 || index < 0) {
    return
  }
  const to = result[index]
  if (to) {
    searchHistory.value.push(to)
    handleClose()
    await nextTick()
    if (isHttpUrl(to.path)) {
      window.open(to.path, '_blank')
    } else {
      router.push({ path: to.path, replace: true })
    }
  }
}

// Arrow key up
function handleUp() {
  if (searchResults.value.length === 0) {
    return
  }
  activeIndex.value--
  if (activeIndex.value < 0) {
    activeIndex.value = searchResults.value.length - 1
  }
  scrollIntoView()
}

// Arrow key down
function handleDown() {
  if (searchResults.value.length === 0) {
    return
  }
  activeIndex.value++
  if (activeIndex.value > searchResults.value.length - 1) {
    activeIndex.value = 0
  }
  scrollIntoView()
}

// close search modal
function handleClose() {
  searchResults.value = []
  emit('close')
}

// Activate when the mouse moves to a certain line
function handleMouseenter(e: MouseEvent) {
  const index = (e.target as HTMLElement)?.dataset.index
  activeIndex.value = Number(index)
}

function removeItem(index: number) {
  if (!props.keyword) {
    searchHistory.value.splice(index, 1)
  }
  searchResults.value.splice(index, 1)

  activeIndex.value = Math.max(activeIndex.value - 1, 0)
  scrollIntoView()
}

// 存储所有需要转义的特殊字符
const code = new Set(['$', '(', ')', '*', '+', '.', '?', '[', '\\', ']', '^', '{', '|', '}'])

// 转换函数，用于转义特殊字符
function transform(c: string) {
  // 如果字符在特殊字符列表中，返回转义后的字符
  // 如果不在，返回字符本身
  return code.has(c) ? `\\${c}` : c
}

// 创建搜索正则表达式
function createSearchReg(key: string) {
  // 将输入的字符串拆分为单个字符
  // 对每个字符进行转义
  // 然后用'.*'连接所有字符，创建正则表达式
  const keys = [...key].map((item) => transform(item)).join('.*')
  // 返回创建的正则表达式
  return new RegExp(`.*${keys}.*`)
}

watch(
  () => props.keyword,
  (val) => {
    if (val) {
      handleSearch(val)
    } else {
      searchResults.value = [...searchHistory.value]
    }
  },
)

onMounted(() => {
  searchItems.value = mapTree(props.menus, (item) => {
    return {
      ...item,
      name: $t(item?.title),
    }
  })
  if (searchHistory.value.length > 0) {
    searchResults.value = [...searchHistory.value]
  }
  // enter search
  onKeyStroke('Enter', handleEnter)
  // Monitor keyboard arrow keys
  onKeyStroke('ArrowUp', handleUp)
  onKeyStroke('ArrowDown', handleDown)
  // esc close
  onKeyStroke('Escape', handleClose)
})
</script>

<template>
  <div class="global-search-panel">
    <div class="global-search-panel-scroll">
      <div class="global-search-panel-content">
        <!-- 无搜索结果 -->
        <div v-if="keyword && searchResults.length === 0" class="global-search-panel-empty">
          <SearchXIcon class="global-search-panel-empty-icon" />
          <p class="global-search-panel-empty-text">
            {{ $t('ui.widgets.search.noResults') }}
            <span class="global-search-panel-empty-text-keyword"> "{{ keyword }}" </span>
          </p>
        </div>
        <!-- 历史搜索记录 & 没有搜索结果 -->
        <div v-if="!keyword && searchResults.length === 0" class="global-search-panel-history">
          <p class="global-search-panel-history-text">
            {{ $t('ui.widgets.search.noRecent') }}
          </p>
        </div>

        <ul v-show="searchResults.length > 0" class="global-search-panel-list">
          <li v-if="searchHistory.length > 0 && !keyword" class="global-search-panel-list-history">
            {{ $t('ui.widgets.search.recent') }}
          </li>
          <li
            v-for="(item, index) in uniqueByField(searchResults, 'key')"
            :key="item.key"
            :class="activeIndex === index ? 'global-search-panel-list-item--active' : ''"
            :data-index="index"
            :data-search-item="index"
            class="global-search-panel-list-item"
            @click="handleEnter"
            @mouseenter="handleMouseenter"
          >
            <ProIcon :icon="item.icon" class="global-search-panel-list-item-icon" fallback />

            <span class="global-search-panel-list-item-text">{{ item.title }}</span>
            <div class="global-search-panel-list-item-delete" @click.stop="removeItem(index)">
              <XIcon />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.global-search-panel {
  position: relative;
  min-height: 160px;
  overflow: hidden;

  &-scroll {
    width: 100%;
    height: 100%;
    overflow: hidden auto;
    border-radius: inherit;
  }

  &-content {
    display: flex;
    justify-content: center;
    height: 100%;
    max-height: 450px;
    padding-right: 8px;
    padding-left: 8px;
  }

  &-empty {
    color: hsl(var(--pro-muted-foreground));
    text-align: center;

    &-icon {
      width: 48px;
      height: 48px;
      margin-top: 16px;
      margin-right: auto;
      margin-left: auto;
    }

    &-text {
      margin-top: 24px;
      margin-bottom: 40px;
      font-size: 12px;
      line-height: 16px;

      &-keyword {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: hsl(var(--pro-foreground));
      }
    }
  }

  &-history {
    color: hsl(var(--pro-muted-foreground));
    text-align: center;

    &-text {
      margin-top: 40px;
      margin-bottom: 40px;
      font-size: 12px;
      line-height: 16px;
    }
  }

  &-list {
    width: 100%;

    &-history {
      margin-bottom: 8px;
      font-size: 12px;
      line-height: 16px;
      color: hsl(var(--pro-muted-foreground));
    }

    &-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 16px;
      margin-bottom: 12px;
      cursor: pointer;
      background-color: hsl(var(--pro-accent));
      border-radius: var(--pro-radius);

      &--active {
        color: hsl(var(--pro-primary-foreground));
        background-color: hsl(var(--pro-primary));
      }

      &-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }

      &-text {
        flex: 1 1 0%;
      }

      &-delete {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border-radius: 9999px;

        &:hover {
          color: hsl(var(--pro-primary-foreground));
          transform: scaleX(1.1) scaleY(1.1);
        }

        &:where(.dark, .dark *):hover {
          background-color: hsl(var(--pro-accent));
        }
      }
    }
  }
}
</style>
