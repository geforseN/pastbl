<template>
  <Html v-bind="localeHead.htmlAttrs">
    <Body>
      <app-drawer class="z-50">
        <div class="relative grid">
          <app-top-nav class="sticky top-0 z-40 bg-base-100/90" />
          <nuxt-loading-indicator />
          <nuxt-layout>
            <nuxt-page />
          </nuxt-layout>
          <speed-insights />
          <emote-on-hover-card
            ref="emoteOnHoverCard"
            v-on-click-outside="emoteOnHover.close"
            :emoji="emoteOnHover.emoji.value"
            :emote="emoteOnHover.emote.value"
            :emote-modifiers="emoteOnHover.emoteModifiers.value"
            @close="emoteOnHover.close"
            @mouseleave="emoteOnHover.close"
          />
          <client-only>
            <pastas-work-mode-toggle
              class="fixed bottom-0 right-1/2 w-max translate-x-1/2 rounded-b-none border-b-0 py-1.5"
            />
          </client-only>
        </div>
      </app-drawer>
    </Body>
  </Html>
</template>
<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/vue";
import { vOnClickOutside } from "@vueuse/components";
import type { EmoteOnHoverCard } from "#build/components";

const localeHead = useLocaleHead({});

useLogRocket("init&identify");

const pastasStore = usePastasStore();

useKeysListenWithAlt([
  ["h", (navigateTo) => navigateTo("/")],
  ["p", (navigateTo) => navigateTo("/pastas")],
  ["f", (navigateTo) => navigateTo("/pastas/find")],
  ["m", (navigateTo) => navigateTo("/user/settings")],
  ["e", (navigateTo) => navigateTo("/collections")],
  ["s", () => savePastasInFile(pastasStore.pastasToShow)],
]);

if (import.meta.client && import.meta.dev) {
  document.body.classList.add("debug-screens");
}

const emoteOnHoverCardRef
  = useTemplateRef<InstanceType<typeof EmoteOnHoverCard>>("emoteOnHoverCard");
const emoteOnHover = useExtendedEmoteOnHover(
  computed(() => emoteOnHoverCardRef.value?.containerRef || raise()),
);
provide("emoteOnHover", emoteOnHover);

onMounted(() => {
  document.documentElement.classList.remove("dark", "light");
});
</script>
<style>
html,
body {
  scrollbar-gutter: stable;
}

/*
  * NOTE: icon class added by nuxt-icon svg's, !important is necessary to override style attribute
 */
.icon {
  font-size: 10px !important;
  line-height: 1 !important;
  overflow-wrap: break-word;
}
</style>
