<template>
  <nuxt-link v-if="props.withLink" external target="_blank" :to="data.href">
    <img v-bind="$attrs" :src="data.src" :alt="data.alt" />
  </nuxt-link>
  <img v-else v-bind="$attrs" :src="data.src" :alt="data.alt" />
</template>
<script lang="ts">
const dataRecord = {
  BetterTTV: {
    src: "/img/bttv-logo-32.png",
    alt: "BetterTTV logo",
    href: "https://betterttv.com",
  },
  FrankerFaceZ: {
    src: "/img/ffz-logo-32.png",
    alt: "FrankerFaceZ logo",
    href: "https://www.frankerfacez.com",
  },
  SevenTV: {
    src: "/img/7tv-logo-32.png",
    alt: "SevenTV logo",
    href: "https://7tv.app",
  },
  Twitch: {
    src: "/img/twitch-logo-32.png",
    alt: "Twitch logo",
    href: "https://twitch.tv",
  },
};
</script>
<script lang="ts" setup>
defineOptions({ inheritAttrs: false });

const props = defineProps<{
  source: import("~/integrations").EmoteSource;
  withLink?: boolean;
}>();

// NOTE: data is not reactive, use computed for reactivity
const data = dataRecord[props.source];
</script>
