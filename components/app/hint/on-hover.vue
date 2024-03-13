<template>
  <div ref="hoveredEmoteContainerRef" class="absolute z-50 flex items-end">
    <div
      v-if="emote"
      class="flex flex-col items-center gap-1 rounded-lg border bg-base-100 p-2"
      :class="emoteModifiers?.length && 'rounded-br-none'"
    >
      <div class="flex max-w-96 items-center gap-1 overflow-x-auto p-1">
        <template v-for="image of emote.images.value" :key="image">
          <img
            :src="image.src"
            :width="image.width"
            :height="image.height"
            :alt="image.alt"
            class="bg-base-200"
            loading="lazy"
          />
        </template>
      </div>
      <div class="flex flex-wrap items-baseline text-lg">
        <span class="text-xl font-bold">{{ emote.token }}</span>
        <span>&nbsp;{{ "-" }}&nbsp;</span>
        <div class="flex items-baseline">
          <emote-integration-logo
            :source="emote.source"
            width="20"
            class="h-min self-center"
          />&nbsp;{{ emote.source }}&nbsp;{{
            $t(oh + "emote.type." + emote.type)
          }}
        </div>
      </div>
      <a
        v-if="emote.integrationLink.canBe()"
        class="link"
        :href="emote.integrationLink.value"
      >
        {{ $t(oh + "emote.page") }}
      </a>
      <dev-only>
        <div class="flex gap-1 text-yellow-400">
          <span v-if="emote.isAnimated">animated</span>
          <span v-if="emote.isListed">listed</span>
          <span v-if="emote.isModifier">modifier</span>
          <span v-if="emote.isWrapper">wrapper</span>
        </div>
      </dev-only>
    </div>
    <div
      v-if="emoteModifiers?.length"
      class="divide flex h-fit flex-col divide-y-2 rounded-r border border-primary bg-base-100"
    >
      <div
        v-for="(modifier, i) of emoteModifiers"
        :key="modifier.token + i"
        class="flex items-center gap-2 p-1"
      >
        <img
          :src="modifier.url.string"
          :width="modifier.width.value"
          :height="modifier.height.value"
          :alt="modifier.token"
          class="bg-base-200"
          loading="lazy"
        />
        {{ modifier.token }} {{ $t(oh + "emote.modifier") }}
        <nuxt-link
          v-if="modifier.integrationLink.canBe()"
          class="link"
          :to="modifier.integrationLink.value"
        >
          {{ $t(oh + "emote.page") }}
        </nuxt-link>
      </div>
    </div>
    <div
      v-if="props.emoji"
      class="flex flex-col items-center gap-1 rounded-lg border bg-base-100 p-2"
    >
      <button
        class="btn btn-square btn-error btn-xs self-end bg-error/20 text-error hover:text-base-content"
        @click="emit('close')"
      >
        X
      </button>
      <span class="text-6xl">{{ props.emoji }}</span>
      <span class="space-x-1">
        <!-- TODO: ? add i18n for emoji name ? -->
        <span>{{ emojiData.name }}</span>
        <span>-</span>
        <span>:{{ emojiData.slug }}:</span>
      </span>
      <span>
        {{ $t("collections.emojis.link") }} -
        {{ $t("collections.emojis.headings." + emojiData.group) }}
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import emoteDataByEmoji from "unicode-emoji-json/data-by-emoji.json";
import { Emote } from "#imports";
import type { IEmote } from "~/integrations";
const oh = "app.hint.onHover." as const;
</script>
<script setup lang="ts">
const props = defineProps<{
  emote?: Nullish<IEmote>;
  emoji?: Nullish<string>;
  emoteModifiers?: Nullish<IEmote[]>;
}>();
const emit = defineEmits<{
  close: [];
}>();
const hoveredEmoteContainerRef = ref<HTMLDivElement>();

defineExpose({
  hoveredEmoteContainerRef,
});

const emote = computed(() => props.emote && Emote.create(props.emote));
const emoteModifiers = computed(() =>
  props.emoteModifiers?.map((modifier) => Emote.create(modifier)),
);

const emoji = computed(() => props.emoji);
const emojiData = computed(() => emoji.value && emoteDataByEmoji[emoji.value]);
</script>
