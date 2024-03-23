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
        <NuxtLoadingIndicator />
        <nuxt-layout>
          <nuxt-page />
        </nuxt-layout>
        <app-hint-on-hover
          ref="onHoverHintRef"
          v-on-click-outside="onHoverHint.onClickOutside"
          :emoji="onHoverHint.emoji.value"
          :emote="onHoverHint.emote.value"
          :emote-modifiers="onHoverHint.emoteModifiers.value"
          @close="onHoverHint.onCloseEmit"
          @mouseleave="onHoverHint.onMouseleave"
        />
        <app-bottom-nav />
        <dev-only>
          <div class="fixed bottom-0 left-0">
            <!-- <label for="asd" class="label cursor-pointer">
            <span class="label-text">Mode</span>
          </label> -->
            <!-- <div class="flex items-center gap-1 border border-b-0 border-l-0">
              Server mode
              <input
                id="asd"
                v-model="userStore.pastasWorkMode.isClient"
                name="asd"
                type="checkbox"
                class="toggle border-secondary bg-secondary [--tglbg:black] hover:bg-secondary/50"
              />
              Client mode
            </div> -->
          </div>
        </dev-only>
        <u-notifications>
          <template #title="{ title }">
            <span class="text-xl">{{ title }}</span>
          </template>
          <template #description="{ description }">
            <span class="font-bold">{{ description }}</span>
          </template>
        </u-notifications>
      </div>
    </Body>
  </div>
</template>
<script setup lang="ts">
import { savePastasToFile } from "./pages/pastas/index.vue";
import type { AppHintOnHover } from "#build/components";

const pastasStore = usePastasStore();

useKeysListenWithAlt([
  ["h", (go) => go("/")],
  ["p", (go) => go("/pastas")],
  ["f", (go) => go("/pastas/find")],
  ["m", (go) => go("/user/settings")],
  ["e", (go) => go("/collections")],
  ["s", () => savePastasToFile(pastasStore.pastas.state)],
]);

const onHoverHintRef = ref<InstanceType<typeof AppHintOnHover>>();
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
