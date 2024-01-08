<template>
  <div class="rounded-box border-2 px-4 py-2">
    <nuxt-link :to="path">
      <span class="flex items-center justify-between gap-2 text-3xl font-bold">
        <span class="flex items-center gap-2">
          <icon name="carbon:link" />
          <slot>{{ text }}</slot>
        </span>
      </span>
    </nuxt-link>
  </div>
</template>
<script setup lang="ts">
const routePageLinkRecord = {
  "global-emotes": {
    path: "/emotes/global",
    text: "Look for global emotes",
  },
  "__active-emotes__": {
    path: "/emotes/active",
    text: "Select active emotes",
  },
} as const;

const props = defineProps<{
  to: keyof typeof routePageLinkRecord;
}>();

const { text, path } = routePageLinkRecord[props.to];
</script>
