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
        :emote="hoveredEmote"
        :emoji="hoveredEmoji"
      />
    </Body>
  </div>
</template>
<script setup lang="ts">
import { savePastasToFile } from "./pages/pastas/index.vue";
import type { AppHintOnHover } from "#build/components";
import type { IEmote } from "~/integrations";
import type { RouteLocation, RouteLocationRaw } from "#vue-router";

useHead({ title: process.dev ? "pastbl - dev" : "pastbl" });

const localePath = useLocalePath();

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

const hoveredEmoji = ref<Nullish<string>>();
const hoveredEmote = ref<Nullish<IEmote>>();
const onHoverHintRef = ref<InstanceType<typeof AppHintOnHover>>();
const onHoverHintRefContainer = computed(
  () => onHoverHintRef.value?.hoveredEmoteContainerRef,
);

function updateHoveredEmoteContainerStyle(event: MouseEvent) {
  assert.ok(onHoverHintRefContainer.value);
  onHoverHintRefContainer.value.style.top = `${event.pageY}px`;
  onHoverHintRefContainer.value.style.left = `${event.pageX}px`;
}

function updateHoveredEmote(value: IEmote, event: MouseEvent) {
  hoveredEmoji.value = null;
  hoveredEmote.value = value;
  updateHoveredEmoteContainerStyle(event);
}

function updateHoveredEmoji(value: string, event: MouseEvent) {
  hoveredEmote.value = null;
  hoveredEmoji.value = value;
  updateHoveredEmoteContainerStyle(event);
}

function removeHovered() {
  hoveredEmote.value = null;
  hoveredEmoji.value = null;
}

function makeMouseoverHandler(options: {
  findEmote: (target: HTMLImageElement) => MaybePromise<IEmote | undefined>;
}) {
  return async function (event: Event) {
    assert.ok(event instanceof MouseEvent);
    const { target, relatedTarget, currentTarget } = event;
    if (!(target instanceof Element)) {
      return withLogSync(null, "not an element");
    }
    if (relatedTarget?.classList.contains("emote-hint")) {
      return withLogSync(removeHovered, "hint is hovered");
    }
    if (target === currentTarget) {
      return withLogSync(removeHovered, "cursor moved away");
    }
    if (target.classList.contains("emoji")) {
      return updateHoveredEmoji(target.innerHTML, event);
    }
    if (
      relatedTarget instanceof HTMLImageElement &&
      !(target instanceof HTMLImageElement)
    ) {
      return removeHovered();
    }
    if (target instanceof HTMLImageElement) {
      const emote = await options.findEmote(target);
      if (!emote) {
        return;
      }
      updateHoveredEmote(emote, event);
    }
  };
}

const onHoverHintInject = {
  hoveredEmote,
  makeMouseoverHandler,
};

export type InjectOnHoverHint = typeof onHoverHintInject;
provide("hoveredEmote", onHoverHintInject);

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
