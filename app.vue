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
          v-on-click-outside="onHoverHint.close"
          :emoji="onHoverHint.emoji.value"
          :emote="onHoverHint.emote.value"
          :emote-modifiers="onHoverHint.emoteModifiers.value"
          @close="onHoverHint.close"
          @mouseleave="onHoverHint.close"
        />
        <app-bottom-nav />
        <client-only>
          <app-pastas-work-mode-toggle />
        </client-only>
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
import { vOnClickOutside } from "@vueuse/components";
import { savePastasToFile } from "./pages/pastas/index.vue";
import type { AppHintOnHover } from "#build/components";

const userStore = useUserStore();
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
const onHoverHint = useExtendedOnHoverHint(
  computed(() => onHoverHintRef.value?.containerRef || raise()),
);
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

input#pastas-work-mode:not(:checked) {
  background-color: theme(colors.twitch-accent);
  border-color: theme(colors.twitch-accent);
}

input#pastas-work-mode:not(:checked):hover {
  background-color: theme(colors.secondary/80%);
}

input#pastas-work-mode:checked:hover {
  background-color: theme(colors.twitch-accent/80%);
}
</style>
