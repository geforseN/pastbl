<template>
  <div class="rounded-btn border-2 p-2" :class="sourceClass">
    <emote-collection-header
      v-bind="{
        isLoading: props.integration.isLoading,
        isError: !!props.integration.error,
        isReady: props.integration.isReady,
      }"
    >
      <h3>{{ props.source }}</h3>
      <template #collection-logo>
        <icon-emote-integration-logo
          :source="props.source"
          class="max-h-[32px]"
          height="32"
        />
      </template>
    </emote-collection-header>
    <div v-if="props.integration.error">
      {{ props.integration.error.message }}
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UnwrapRef } from "nuxt/dist/app/compat/capi";
import type { AvailableEmoteSource } from "~/integrations";

const sourceClassRecord: Record<AvailableEmoteSource, string> = {
  BetterTTV: "border-[#63b3ed] bg-[#1a202c]",
  FrankerFaceZ: "border-ffz bg-[#222222]",
  SevenTV: "border-[#2599cd] bg-[#181d1f]",
} as const;

type T = ReturnType<typeof useUserIntegrations>;

const props = defineProps<{
  source: AvailableEmoteSource;
  integration: UnwrapRef<
    T["bttv"] | T["ffz"]["fullCollection"] | T["sevenTv"]["fullCollection"]
  >;
}>();

const sourceClass = sourceClassRecord[props.source];
</script>
