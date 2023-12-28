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
  <img
    v-else-if="props.source === 'Twitch'"
    src="/img/twitch-logo-32.png"
    alt="Twitch logo"
  />
</template>
<script lang="ts" setup>
const props = defineProps<{
  source: import("~/integrations").EmoteSource;
}>();
</script>
