<template>
  <div class="rounded-box border-2 px-4 py-2">
    <nuxt-link-locale :to="path">
      <span class="flex items-center justify-between gap-2 text-2xl font-bold">
        <span class="flex items-center gap-2">
          <slot name="left"><icon name="carbon:link" /></slot>
          <slot name="default">{{ text }}</slot>
        </span>
        <slot name="right" />
      </span>
    </nuxt-link-locale>
  </div>
</template>
<script setup lang="ts">
defineSlots<{
  left?: () => unknown;
  right?: () => unknown;
  default?: () => unknown;
}>();

const { t } = useI18n();

const routePageLinkRecord = {
  "global-emotes": {
    path: "/collections/global",
    text: t("collections.global.link"),
  },
  "users-emotes": {
    path: "/collections/users",
    text: t("collections.users.link"),
  },
  emotes: {
    path: "/collections",
    text: t("collections.index.link"),
  },
  main: {
    path: "/",
    text: t("main.link"),
  },
  "user-settings": {
    path: "/user/settings#heading",
    text: t("user.settings.link"),
  },
  pastas: {
    path: "/pastas",
    text: t("pastas.link"),
  },
  "find-pasta": {
    path: "/pastas/find#heading",
    text: t("pasta.find.link"),
  },
  emojis: {
    path: "/collections/emojis",
    text: t("collections.emojis.link"),
  },
} as const;
const props = defineProps<{
  to: keyof typeof routePageLinkRecord;
}>();

const { text, path } = routePageLinkRecord[props.to];
</script>
