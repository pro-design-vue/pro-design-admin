<script setup lang="ts">
import type { MenuRecordRaw } from '@/typings'

import type { NormalMenuProps } from './normal-menu'
import { computed } from 'vue'
import { ProIcon } from '@/components/common'

interface Props extends NormalMenuProps {}

defineOptions({
  name: 'NormalMenu',
})

const props = withDefaults(defineProps<Props>(), {
  activePath: '',
  collapse: false,
  menus: () => [],
  theme: 'dark',
})

const emit = defineEmits<{
  enter: [MenuRecordRaw]
  select: [MenuRecordRaw]
}>()

const menuClass = computed(() => ({
  [props.theme]: true,
  'normal-menu': true,
  'is-collapse': props.collapse,
  [`is-${props.theme}`]: true,
  'is-rounded': props.rounded,
}))
</script>

<template>
  <ul :class="menuClass" class="relative">
    <template v-for="menu in menus" :key="menu.path">
      <li
        :class="['normal-menu__item', activePath === menu.path ? 'is-active' : '']"
        @click="() => emit('select', menu)"
        @mouseenter="() => emit('enter', menu)"
      >
        <ProIcon class="normal-menu__icon" :icon="menu.icon" fallback />

        <span class="normal-menu__title"> {{ menu.title }}</span>
      </li>
    </template>
  </ul>
</template>
<style lang="less" scoped>
.normal-menu {
  --menu-item-margin-y: 4px;
  --menu-item-margin-x: 0px;
  --menu-item-padding-y: 9px;
  --menu-item-padding-x: 0px;
  --menu-item-radius: 0px;

  position: relative;
  height: calc(100% - 4px);

  &.is-rounded {
    --menu-item-radius: 6px;
    --menu-item-margin-x: 8px;
  }

  &.is-dark {
    .normal-menu__item {
      color: hsl(var(--pro-foreground) / 80%);

      &:not(.is-active):hover {
        color: hsl(var(--pro-foreground));
      }

      &.is-active {
        .normal-menu__name,
        .normal-menu__icon {
          color: hsl(var(--pro-foreground));
        }
      }
    }
  }

  &.is-collapse {
    .normal-menu__name {
      width: 0;
      height: 0;
      margin-top: 0;
      overflow: hidden;
      opacity: 0;
    }

    .normal-menu__icon {
      font-size: 20px;
    }
  }

  &__item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // max-width: 64px;
    // max-height: 64px;
    padding: var(--menu-item-padding-y) var(--menu-item-padding-x);
    margin: var(--menu-item-margin-y) var(--menu-item-margin-x);
    color: hsl(var(--pro-foreground) / 90%);
    cursor: pointer;
    border-radius: var(--menu-item-radius);
    transition:
      background 0.15s ease,
      padding 0.15s ease,
      border-color 0.15s ease;

    &.is-active {
      color: hsl(var(--pro-primary));
      background-color: hsl(var(--pro-primary));

      &:where(.dark, .dark *) {
        background-color: hsl(var(--pro-accent));
      }

      .normal-menu__title,
      .normal-menu__icon {
        font-weight: 600;
        color: hsl(var(--pro-primary-foreground));
      }
    }

    &:not(.is-active):hover {
      color: hsl(var(--pro-primary));
      background-color: hsl(var(--pro-heavy));

      &:where(.dark, .dark *) {
        color: hsl(var(--pro-foreground));
        background-color: hsl(var(--pro-accent));
      }
    }

    &:hover {
      .normal-menu__icon {
        transform: scale(1.2);
      }
    }
  }

  &__icon {
    max-height: 20px;
    font-size: 20px;
    transition: all 0.25s ease;
  }

  &__title {
    margin-top: 8px;
    margin-bottom: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    font-weight: 400;
    white-space: nowrap;
    transition: all 0.25s ease;
  }
}
</style>
