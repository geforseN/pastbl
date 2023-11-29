<template>
  <img
    v-if="props.source === 'FrankerFaceZ'"
    src="/img/ffz-logo-32.png"
    alt="FrankerFaceZ logo"
  />
  <img
    v-else-if="props.source === 'BetterTTV'"
    src="/img/bttv-logo-32.png"
    alt="BetterTTV logo"
  />
  <img
    v-else-if="props.source === 'SevenTV'"
    src="/img/7tv-logo-32.png"
    alt="SevenTV logo"
  />
</template>
<script lang="ts" setup>
import type { AvailableEmoteSource } from "~/integrations";

const props = defineProps<{
  source: AvailableEmoteSource;
}>();
</script>
