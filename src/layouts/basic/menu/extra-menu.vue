<!--
 * @Author: shen
 * @Date: 2025-06-18 15:59:23
 * @LastEditors: shen
 * @LastEditTime: 2025-06-30 15:10:27
 * @Description:
-->
<script setup lang="ts">
import type { MenuRecordRaw } from '@/typings'
import type { MenuProps, ItemType } from 'ant-design-vue'

import { Menu } from 'ant-design-vue'
import { computed, h, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigation } from './use-navigation'
import { cloneDeep, findMenuByPath, mapTree } from '@/shared/utils'
import { ProIcon } from '@/components/common'
import { $t } from '@/locales'

interface Props extends Omit<MenuProps, 'onSelect' | 'onOpenChange' | 'items'> {
  menus?: MenuRecordRaw[]
  rounded?: boolean
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accordion: true,
  menus: () => [],
})

const route = useRoute()
const items = ref<ItemType[]>([])
const openKeys = ref<string[]>([])
const { navigation } = useNavigation()
const selectedKeys = computed(() => [route.path])

/**
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

const handleMenuSelect: MenuProps['onSelect'] = async ({ key }) => {
  await navigation(key as string)
}

const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
  console.log('🚀 ~ handleOpenChange ~ keys:', keys)
  // const latestOpenKey = keys.find(key => openKeys.value.indexOf(key) === -1);
  // if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
  //   state.openKeys = keys;
  // } else {
  //   state.openKeys = latestOpenKey ? [latestOpenKey] : [];
  // }
}

watchEffect(() => {
  items.value = wrapperMenus(props.menus)
  const menu = findMenuByPath(props.menus, route.path)
  if (menu && menu.parents?.length) {
    openKeys.value = [...menu.parents]
  }
})
</script>

<template>
  <Menu
    class="layout-menu"
    :class="theme"
    :items
    :mode="mode"
    :inline-collapsed="collapsed"
    :selected-keys="selectedKeys"
    :open-keys="openKeys"
    @select="handleMenuSelect"
    @openChange="handleOpenChange"
  />
</template>
