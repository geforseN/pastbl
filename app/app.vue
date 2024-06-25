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
      <Meta
        name="google-site-verification"
        content="CgANEjqKJNLsIr9m7Jf_2iVg107bGXAAsEFiL3UI2cw"
      />
      <Meta name="theme-color" content="#ff52d9f2" />
    </Head>
    <Body>
      <app-drawer class="z-50">
        <div class="relative grid">
          <app-top-nav class="sticky top-0 z-40 bg-base-100/90" />
          <nuxt-loading-indicator />
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
          <!-- <client-only>
            <app-pastas-work-mode-toggle
              class="fixed bottom-0 right-1/2 w-max translate-x-1/2 rounded-b-none border-b-0 pb-1.5 pt-1.5"
            />
          </client-only> -->
          <u-notifications>
            <template #title="{ title }">
              <span class="text-xl">{{ title }}</span>
            </template>
            <template #description="{ description }">
              <span class="font-bold">{{ description }}</span>
            </template>
          </u-notifications>
        </div>
      </app-drawer>
    </Body>
  </div>
</template>
<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
import { savePastasToFile } from "~/pages/pastas/index.vue";
import type { AppHintOnHover } from "#build/components";

const pastasStore = usePastasStore();

useKeysListenWithAlt([
  ["h", (go) => go("/")],
  ["p", (go) => go("/pastas")],
  ["f", (go) => go("/pastas/find")],
  ["m", (go) => go("/user/settings")],
  ["e", (go) => go("/collections")],
  ["s", () => savePastasToFile(pastasStore.pastasToShow)],
]);

if (import.meta.client && import.meta.dev) {
  document.body.classList.add("debug-screens");
}

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

/* NOTE: 
  icon class added by nuxt-icon svg's 
  !important is necessary to override style attribute  
*/
.icon {
  font-size: 10px !important;
  line-height: 1 !important;
  overflow-wrap: break-word;
}

html,
body {
  scrollbar-gutter: stable;
}
</style>
