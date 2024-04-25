<template>
  <nuxt-link-locale
    :to="path"
    class="group block rounded-box border-2 px-4 py-2 hover:border-base-content hover:bg-base-300"
  >
    <span class="flex items-center justify-between gap-2 text-2xl font-bold">
      <span class="flex items-center gap-2">
        <slot name="left"><icon name="carbon:link" /></slot>
        <span class="group-hover:underline">
          <slot name="default">{{ $t(textKey) }}</slot>
        </span>
      </span>
      <slot name="right" />
    </span>
  </nuxt-link-locale>
</template>
<script lang="ts">
const routePageLinkRecord = {
  "global-emotes": {
    path: "/collections/global",
    textKey: "collections.global.link",
  },
  "users-emotes": {
    path: "/collections/users",
    textKey: "collections.users.link",
  },
  emotes: {
    path: "/collections",
    textKey: "collections.index.link",
  },
  main: {
    path: "/",
    textKey: "main.link",
  },
  "user-settings": {
    path: "/user/settings#heading",
    textKey: "user.settings.link",
  },
  pastas: {
    path: "/pastas",
    textKey: "pastas.link",
  },
  "find-pasta": {
    path: "/pastas/find#heading",
    textKey: "pasta.find.link",
  },
  emojis: {
    path: "/collections/emojis",
    textKey: "collections.emojis.link",
  },
} as const satisfies Record<string, { path: string; textKey: string }>;
</script>
<script setup lang="ts">
const props = defineProps<{
  to: keyof typeof routePageLinkRecord;
}>();

defineSlots<{
  left?: () => unknown;
  right?: () => unknown;
  default?: () => unknown;
}>();

const { textKey, path } = routePageLinkRecord[props.to];
</script>
