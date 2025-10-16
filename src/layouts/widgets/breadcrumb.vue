<!--
 * @Author: shen
 * @Date: 2025-06-20 10:05:17
 * @LastEditors: shen
 * @LastEditTime: 2025-10-16 20:10:50
 * @Description:
-->
<script lang="ts" setup>
import { computed, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronRightIcon } from '@/icons'
import { Breadcrumb } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { ProIcon } from '@/components/common'
import { $t } from '@/shared/locales'

interface Props {
  hideWhenOnlyOne?: boolean
  showHome?: boolean
  showIcon?: boolean
}

interface IBreadcrumb {
  icon?: Component | string
  path: string
  title: string
}

const props = withDefaults(defineProps<Props>(), {
  showHome: false,
  showIcon: false,
})

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed((): IBreadcrumb[] => {
  const matched = [...(route.meta.parents ?? []), route.matched[route.matched.length - 1]]
  const resultBreadcrumb: IBreadcrumb[] = []

  for (const match of matched) {
    const { meta, path } = match
    const { hideChildrenInMenu, hideInBreadcrumb, icon, name, title } = meta || {}
    if (hideInBreadcrumb || hideChildrenInMenu || !path) {
      continue
    }

    resultBreadcrumb.push({
      icon,
      path: path || route.path,
      title: title ? $t((title || name) as string) : '',
    })
  }
  if (props.hideWhenOnlyOne && resultBreadcrumb.length === 1) {
    return []
  }
  return resultBreadcrumb
})

const handleSelect = (path: string, isLast: boolean = false) => {
  if (!isLast) {
    router.push(path)
  }
}

const handleGoBack = () => {
  router.go(-1)
}
</script>
<template>
  <div class="breadcrumb">
    <Breadcrumb style="margin-right: 15px">
      <Breadcrumb.Item href="back" @click="handleGoBack">
        <div class="breadcrumb-item">
          <ArrowLeftOutlined style="font-size: 16px; color: hsl(var(--pro-foreground))" />
        </div>
      </Breadcrumb.Item>
    </Breadcrumb>
    <!-- <Breadcrumb v-if="showHome" style="margin-right: 15px">
      <Breadcrumb.Item href="/" @click="handleSelect('/')">
        <div class="breadcrumb-item">
          <ProIcon icon="home" style="font-size: 16px" />
        </div>
      </Breadcrumb.Item>
    </Breadcrumb> -->
    <Breadcrumb>
      <template #separator>
        <ChevronRightIcon />
      </template>
      <Breadcrumb.Item
        v-for="(item, index) in breadcrumbs"
        :key="`${item.path}-${item.title}-${index}`"
        :href="index + 1 !== breadcrumbs.length ? item.path : undefined"
        @click="handleSelect(item.path, index + 1 === breadcrumbs.length)"
      >
        <div class="breadcrumb-item">
          <ProIcon
            v-if="showIcon && item.icon"
            :icon="item.icon"
            style="margin-right: 5px; font-size: 16px"
          />
          <span> {{ item.title }}</span>
        </div>
      </Breadcrumb.Item>
    </Breadcrumb>
  </div>
</template>

<style lang="less" scoped>
.breadcrumb {
  display: flex;
  margin-left: 8px;

  & li {
    display: flex;
    align-items: center;

    ::v-deep(a) {
      height: 25px;
    }
  }

  &-item {
    display: inline-flex;
    align-items: center;
    height: 25px;
  }
}
</style>
