<template>
  <div ref="containerRef" class="absolute z-50 flex items-end">
    <div
      v-if="emote"
      class="flex max-w-96 flex-col items-center gap-1 rounded-lg border p-2 text-white"
      :class="[
        emoteModifiers?.length && 'rounded-br-none',
        collectionsStyles[emote.source].backgroundBase,
      ]"
    >
      <button
        class="btn btn-square btn-error btn-xs self-end bg-error/20 text-error hover:text-base-content"
        @click="emit('close')"
      >
        X
      </button>
      <div
        class="flex items-center gap-1 overflow-x-auto p-1 scrollbar"
        :class="collectionsStyles[emote.source].scrollbar"
      >
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
      <div class="text-center text-lg">
        <nuxt-link
          v-if="emote.integrationLink.canBe()"
          external
          target="_blank"
          class="link line-clamp-3 inline break-all text-xl font-bold"
          :href="emote.integrationLink.value"
        >
          {{ emote.token }}
        </nuxt-link>
        <span v-else class="line-clamp-2 inline max-w-48 break-all font-bold">
          {{ emote.token }}
        </span>
        <span>&nbsp;{{ "-" }}&nbsp;</span>
        <span class="inline-flex items-baseline">
          <emote-integration-logo
            :source="emote.source"
            width="20"
            class="inline h-min self-center"
          />&nbsp;{{ emote.source }}&nbsp;{{
            $t(oh + "emote.type." + emote.type)
          }}
        </span>
      </div>
      <dev-only>
        <div class="flex flex-nowrap gap-1 text-yellow-400">
          <span v-if="emote.isAnimated">animated</span>
          <span v-if="emote.isListed">listed</span>
          <span v-if="emote.isModifier">modifier</span>
          <span v-if="emote.isWrapper">wrapper</span>
        </div>
      </dev-only>
    </div>
    <div
      v-if="emoteModifiers?.length"
      class="divide h-fit divide-y-2 rounded-r border border-primary bg-base-100"
    >
      <div
        v-for="(modifier, i) of emoteModifiers"
        :key="modifier.token + i"
        class="flex items-center p-1"
      >
        <img
          :src="modifier.url.string"
          :width="modifier.width.value"
          :height="modifier.height.value"
          :alt="modifier.token"
          class="bg-base-200"
          loading="lazy"
        />
        <nuxt-link
          v-if="modifier.integrationLink.canBe()"
          external
          target="_blank"
          class="link line-clamp-2 max-w-48 break-all font-bold"
          :href="modifier.integrationLink.value"
        >
        </nuxt-link>
        <span v-else class="line-clamp-2 max-w-48 break-all font-bold">
          {{ modifier.token }}
        </span>
        {{ $t(oh + "emote.modifier") }}
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
import { collectionsStyles } from "~/components/emote-collection";
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
const containerRef = ref<HTMLDivElement>();

defineExpose({
  containerRef,
});

const emote = computed(
  () => props.emote && OnHoverHintEmote.create(props.emote),
);
const emoteModifiers = computed(() =>
  props.emoteModifiers?.map((modifier) => OnHoverHintEmote.create(modifier)),
);

const emoji = computed(() => props.emoji);
const emojiData = computed(() => emoji.value && emoteDataByEmoji[emoji.value]);
</script>
