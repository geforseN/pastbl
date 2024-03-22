<template>
  <div>
    <Head>
      <Link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <Link rel="manifest" href="/site.webmanifest" />
    </Head>
    <Body lang="en">
      <div class="relative grid grid-rows-layout">
        <app-top-nav />
        <nuxt-layout>
          <nuxt-page />
        </nuxt-layout>
        <app-bottom-nav />
        <u-notifications>
          <template #title="{ title }">
            <span class="text-xl">{{ title }}</span>
          </template>
          <template #description="{ description }">
            <span class="font-bold">{{ description }}</span>
          </template>
        </u-notifications>
      </div>
      <app-hint-on-hover
        ref="onHoverHintRef"
        v-on-click-outside="onHoverHint.onClickOutside"
        :emoji="onHoverHint.emoji.value"
        :emote="onHoverHint.emote.value"
        :emote-modifiers="onHoverHint.emoteModifiers.value"
        @close="onHoverHint.onCloseEmit"
        @mouseleave="onHoverHint.onMouseleave"
      />
    </Body>
  </div>
</template>
<script setup lang="ts">
import { savePastasToFile } from "./pages/pastas/index.vue";
import type { AppHintOnHover } from "#build/components";
import type { RouteLocation, RouteLocationRaw } from "#vue-router";

const localePath = useLocalePath();

const onHoverHintRef = ref<InstanceType<typeof AppHintOnHover>>();

const go = (path: RouteLocation | RouteLocationRaw) =>
  navigateTo(localePath(path));

const handlersMap = new Map([
  ["h", () => go("/")],
  ["p", () => go("/pastas")],
  ["f", () => go("/pastas/find")],
  ["m", () => go("/user/settings")],
  ["e", () => go("/collections")],
  ["s", () => savePastasToFile(usePastasStore().pastas.state)],
]);

onKeyStroke((event) => {
  const { key, altKey } = event;
  if (!altKey || !handlersMap.has(key)) {
    return;
  }
  event.preventDefault();
  const handler = handlersMap.get(key);
  assert.ok(handler instanceof Function);
  return handler();
});

const onHoverHint = useOnHoverHint(
  computed(() => onHoverHintRef.value?.containerRef || raise()),
);

export type OnHoverHint = typeof onHoverHint;
provide("onHoverHint", onHoverHint);

onMounted(() => {
  document.documentElement.classList.remove("dark", "light");
});
</script>
<style>
.emote {
  display: inline;
  margin: -5px 0;
}
</style>
