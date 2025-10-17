<!--
 * @Author: shen
 * @Date: 2025-06-18 15:59:23
 * @LastEditors: shen
 * @LastEditTime: 2025-10-17 13:13:46
 * @Description:
-->
<script setup lang="ts">
import type { MenuRecordRaw } from '@/typings'
import type { ItemType, MenuProps } from 'ant-design-vue'

import { Menu } from 'ant-design-vue'
import { computed, h, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ProIcon } from '@/components/common'
import { cloneDeep, findMenuByPath, mapTree } from '@/shared/utils'
import { $t } from '@/locales'

interface Props extends Omit<MenuProps, 'items' | 'onSelect' | 'onOpenChange'> {
  defaultActive?: string
  collapsed?: boolean
  rounded?: boolean
  accordion?: boolean
  menus?: MenuRecordRaw[]
}

const props = withDefaults(defineProps<Props>(), {
  accordion: true,
  defaultActive: '',
  menus: () => [],
})

const emit = defineEmits<{
  open: [string, string[]]
  select: [string, string?]
}>()

const route = useRoute()
const items = ref<ItemType[]>([])
const openKeys = ref<string[]>([])
let rootSubmenuKeys: string[] = []
const selectedKeys = computed(() => [props.defaultActive])

/*
 * 包装菜单，生成ICON图标
 * @param menus 原始菜单数据
 */
function wrapperMenus(menus: MenuRecordRaw[]) {
  return mapTree(menus, (item) => ({
    ...cloneDeep(item),
    title: $t(item.title),
    icon: h(ProIcon, { icon: item.icon, fallback: true }),
  }))
}

const handleMenuSelect: MenuProps['onSelect'] = ({ key }) => {
  emit('select', key as string, props.mode)
}

const handleMenuOpen: MenuProps['onOpenChange'] = (keys) => {
  if (props.mode !== 'inline' || props.collapsed) {
    return
  }
  let newOpenKeys: string[] = []
  if (!props.accordion) {
    newOpenKeys = keys as string[]
  } else {
    const latestOpenKey = keys.find((key) => openKeys.value.indexOf(key as string) === -1) as string
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      newOpenKeys = keys as string[]
    } else {
      newOpenKeys = latestOpenKey ? [latestOpenKey] : []
    }
  }
  openKeys.value = newOpenKeys
}

watch(
  () => props.menus,
  async () => {
    items.value = wrapperMenus(props.menus)
    rootSubmenuKeys = props.menus.filter((item) => item).map((item) => item?.path) as string[]
    if (props.mode === 'inline' && !props.collapsed) {
      setTimeout(() => {
        const menu = findMenuByPath(props.menus, route.path)
        if (menu && menu.parents?.length) {
          openKeys.value = [...menu.parents]
        }
      }, 0)
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => route.path,
  async () => {
    if (props.mode === 'inline' && !props.collapsed) {
      setTimeout(() => {
        const menu = findMenuByPath(props.menus, route.path)
        if (menu && menu.parents?.length) {
          openKeys.value = [...menu.parents]
        }
      }, 0)
    }
  },
)

watch(
  () => props.collapsed,
  (newValue) => {
    if (props.mode === 'inline' && !newValue) {
      const menu = findMenuByPath(props.menus, route.path)
      if (menu && menu.parents?.length) {
        openKeys.value = [...menu.parents]
      }
    }
  },
)
</script>

<template>
  <Menu
    class="layout-menu"
    :items
    :class="theme"
    :mode="mode"
    :inline-collapsed="collapsed"
    :selected-keys="selectedKeys"
    :open-keys="mode === 'inline' && !collapsed ? openKeys : []"
    @select="handleMenuSelect"
    @open-change="handleMenuOpen"
  />
</template>
