<template>
  <div class="rounded-box border-2 px-4 py-2">
    <nuxt-link :to="path">
      <span class="flex items-center justify-between gap-2 text-3xl font-bold">
        <span class="flex items-center gap-2">
          <icon name="carbon:link" />
          <slot name="default">{{ text }}</slot>
        </span>
        <slot name="right" />
      </span>
    </nuxt-link>
  </div>
</template>
<script setup lang="ts">
defineSlots<{
  default?: () => unknown;
  right?: () => unknown;
}>();

const routePageLinkRecord = {
  "global-emotes": {
    path: "/collections/global",
    text: "Look global emotes",
  },
  emotes: {
    path: "/collections",
    text: "Look emotes",
  },
  main: {
    path: "/",
    text: "Go to main page",
  },
} as const;
const props = defineProps<{
  to: keyof typeof routePageLinkRecord;
}>();

const { text, path } = routePageLinkRecord[props.to];
</script>
