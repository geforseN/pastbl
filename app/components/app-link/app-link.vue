<template>
  <nuxt-link-locale
    :to="path"
    class="rounded-box hover:border-base-content hover:bg-base-300 group block border-2 px-4 py-2"
  >
    <span
      class="xs:text-2xl flex items-center justify-between gap-2 text-lg font-bold"
    >
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
    path: "/collections/persons",
    textKey: "collections.users.link",
  },
  emotesAndEmojis: {
    path: "/collections",
    textKey: "emotesAndEmojis",
  },
  main: {
    path: "/",
    textKey: "mainPage",
  },
  "user-settings": {
    path: "/settings#heading",
    textKey: "settings.change",
  },
  pastas: {
    path: "/pastas",
    textKey: "pastas._",
  },
  "find-pasta": {
    path: "/pastas/find#heading",
    textKey: "pasta.find.link",
  },
  emojis: {
    path: "/collections/emojis",
    textKey: "emojis._",
  },
} as const satisfies Record<string, { path: string; textKey: string }>;
</script>
<script setup lang="ts">
const props = defineProps<{
  to: keyof typeof routePageLinkRecord;
}>();

defineSlots<{
  left?: VueSlot;
  right?: VueSlot;
  default?: VueSlot;
}>();

const { textKey, path } = routePageLinkRecord[props.to];
</script>
