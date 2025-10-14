<script lang="ts" setup>
import { computed, nextTick } from 'vue'

import { Button } from 'ant-design-vue'

defineOptions({
  name: 'ThemeToggleButton',
})

const isDark = defineModel<boolean>()

const theme = computed(() => {
  return isDark.value ? 'light' : 'dark'
})

function toggleTheme(event: MouseEvent) {
  const isAppearanceTransition =
    // @ts-expect-error
    document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isAppearanceTransition || !event) {
    isDark.value = !isDark.value
    return
  }
  document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })
}
</script>

<template>
  <Button
    shape="circle"
    type="text"
    :class="[`is-${theme}`]"
    class="theme-toggle"
    @click.stop="toggleTheme"
  >
    <template #icon>
      <svg aria-hidden="true" class="theme-toggle-svg" height="24" viewBox="0 0 24 24" width="24">
        <mask
          id="theme-toggle-moon"
          class="theme-toggle__moon"
          fill="hsl(var(--pro-foreground)/80%)"
          stroke="none"
        >
          <rect fill="white" height="100%" width="100%" x="0" y="0" />
          <circle cx="40" cy="8" fill="black" r="11" />
        </mask>
        <circle
          id="sun"
          class="theme-toggle__sun"
          cx="12"
          cy="12"
          mask="url(#theme-toggle-moon)"
          r="11"
        />
        <g class="theme-toggle__sun-beams">
          <line x1="12" x2="12" y1="1" y2="3" />
          <line x1="12" x2="12" y1="21" y2="23" />
          <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
          <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
          <line x1="1" x2="3" y1="12" y2="12" />
          <line x1="21" x2="23" y1="12" y2="12" />
          <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
          <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
        </g>
      </svg>
    </template>
  </Button>
</template>

<style lang="less" scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;

  &-svg {
    width: 18px;
    height: 18px;
    color: hsl(var(--pro-foreground));
  }

  &__moon {
    & > circle {
      transition: transform 0.5s cubic-bezier(0, 0, 0.3, 1);
    }
  }

  &__sun {
    fill: hsl(var(--pro-foreground) / 90%);
    stroke: none;
    transform-origin: center center;
    transition: transform 1.6s cubic-bezier(0.25, 0, 0.2, 1);

    &:hover > svg > & {
      fill: hsl(var(--pro-foreground) / 90%);
    }
  }

  &__sun-beams {
    stroke: hsl(var(--pro-foreground) / 90%);
    stroke-width: 2px;
    transform-origin: center center;
    transition:
      transform 1.6s cubic-bezier(0.5, 1.5, 0.75, 1.25),
      opacity 0.6s cubic-bezier(0.25, 0, 0.3, 1);

    &:hover > svg > & {
      stroke: hsl(var(--pro-foreground));
    }
  }

  &.is-light {
    .theme-toggle__sun {
      transform: translate(0, 0) rotate(0) skewX(0) skewY(0) scaleX(0.5) scaleY(0.5);
    }

    .theme-toggle__sun-beams {
      transform: rotateZ(0.25turn);
    }
  }

  &.is-dark {
    .theme-toggle__moon {
      & > circle {
        transform: translateX(-20px);
      }
    }

    .theme-toggle__sun-beams {
      opacity: 0;
    }
  }

  &:hover > svg {
    .theme-toggle__sun,
    .theme-toggle__moon {
      fill: hsl(var(--pro-foreground));
    }
  }
}
</style>
