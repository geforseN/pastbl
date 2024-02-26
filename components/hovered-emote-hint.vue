<template>
  <div ref="hoveredEmoteContainerRef" class="absolute z-50">
    <div
      v-if="emote_"
      class="flex flex-col items-center gap-1 rounded-lg border bg-base-100 p-2"
    >
      <div class="flex max-w-96 items-center gap-1 overflow-x-auto p-1">
        <template v-for="image of images" :key="image">
          <img
            :src="image.src"
            :width="image.width"
            :height="image.height"
            :alt="image.alt"
            loading="lazy"
          />
        </template>
      </div>
      <div class="flex flex-wrap items-baseline text-lg">
        <span class="text-xl font-bold">{{ emote_.token }}</span>
        <span>&nbsp;{{ "-" }}&nbsp;</span>
        <div class="flex items-baseline">
          <emote-integration-logo
            :source="emote_.source"
            width="20"
            class="h-min self-center"
          />&nbsp;{{ emote_.source }}&nbsp;{{ emote_.type }}&nbsp;emote
        </div>
      </div>
      <nuxt-link
        v-if="emoteIntegrationLink"
        class="link"
        :to="emoteIntegrationLink"
      >
        Link to emote page
      </nuxt-link>
      <dev-only>
        <div class="flex gap-1 text-yellow-400">
          <span v-if="emote_.isAnimated">animated</span>
          <span v-if="emote_.isListed">listed</span>
          <span v-if="emote_.isModifier">modifier</span>
          <span v-if="emote_.isWrapper">wrapper</span>
        </div>
      </dev-only>
    </div>
    <div
      v-if="props.emoji"
      class="flex flex-col items-center gap-1 rounded-lg border bg-base-100 p-2"
    >
      {{ props.emoji }}
      <span>name:{{ emojiData.name }}</span>
      <span>slug:{{ emojiData.slug }}</span>
      <span>group:{{ emojiData.group }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import emoteDataByEmoji from "unicode-emoji-json/data-by-emoji.json";
import type { IEmote } from "~/integrations";

const emoteSizes = [1, 2, 3, 4] as const;

const emoteIntegrationsLinksGetters = {
  FrankerFaceZ: (emote: IEmote) =>
    `https://www.frankerfacez.com/emoticon/${emote.id}-${emote.token}`,
  BetterTTV: (emote: IEmote) => `https://betterttv.com/emotes/${emote.id}`,
  SevenTV: (emote: IEmote) => `https://7tv.app/emotes/${emote.id}`,
} as const;
</script>
<script setup lang="ts">
const props = defineProps<{
  emote?: Nullish<IEmote>;
  emoji?: Nullish<string>;
}>();

const hoveredEmoteContainerRef = ref<HTMLDivElement>();

defineExpose({
  hoveredEmoteContainerRef,
});

const emote_ = computed(() => props.emote && new Emote({ ...props.emote }));
const emoteIntegrationLink = computed(() => {
  if (!emote_.value) {
    return;
  }
  const getLink: (emote: IEmote) => string =
    emoteIntegrationsLinksGetters[emote_.value.source];
  if (!getLink) {
    return;
  }
  return getLink(emote_.value);
});

const emoji = computed(() => props.emoji);
const emojiData = computed(() => emoji.value && emoteDataByEmoji[emoji.value]);

const images = computed(() => {
  const emote = emote_.value;
  if (!emote) {
    return [];
  }
  return emoteSizes
    .filter((size) => emote.canHaveSize(size))
    .map((size) => {
      return {
        size,
        src: emote.url.withSizeOf(size),
        width: emote.width.multiplyBy(size).value,
        height: emote.height.multiplyBy(size).value,
        alt: emote.token,
      };
    });
});
</script>
