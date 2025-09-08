<!--
 * @Author: shen
 * @Date: 2025-06-20 15:26:27
 * @LastEditors: shen
 * @LastEditTime: 2025-06-26 14:39:05
 * @Description:
-->
<script lang="ts" setup>
interface Props {
  companyName?: string
  companySiteLink?: string
  date?: string
  icp?: string
  icpLink?: string
}

defineOptions({
  name: 'Copyright',
})

withDefaults(defineProps<Props>(), {
  companyName: 'Pro Admin',
  companySiteLink: '',
  date: '2025',
  icp: '',
  icpLink: '',
})
</script>

<template>
  <div class="layout-copyright">
    <!-- ICP Link -->
    <a
      v-if="icp"
      :href="icpLink || 'javascript:void(0)'"
      class="layout-copyright-link"
      target="_blank"
    >
      {{ icp }}
    </a>

    <!-- Copyright Text -->
    Copyright © {{ date }}

    <!-- Company Link -->
    <a
      v-if="companyName"
      :href="companySiteLink || 'javascript:void(0)'"
      class="copyright-link"
      target="_blank"
    >
      {{ companyName }}
    </a>
  </div>
</template>

<style lang="less" scoped>
.copyright {
  display: flex;
  align-items: center;
  justify-content: center;

  &-link {
    margin: 0 4px;

    &:hover {
      color: hsl(var(--pro-primary-600));
    }
  }
}
</style>
