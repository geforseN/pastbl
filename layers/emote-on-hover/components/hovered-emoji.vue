<template>
  <div
    class="flex flex-col items-center gap-1 rounded-lg border bg-base-100 p-2"
  >
    <emote-on-hover-card-close-button @click="$emit('close')" />
    <span class="text-6xl">{{ emoji }}</span>
    <span class="space-x-1">
      <!-- TODO: ? add i18n for emoji name ? -->
      <span>{{ emojiData.name }}</span>
      <span>-</span>
      <span>:{{ emojiData.slug }}:</span>
    </span>
    <span>
      {{ $t("emojis._") }} -
      {{ $t("emojis._headings." + emojiData.group) }}
    </span>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import emoteDataByEmoji from "unicode-emoji-json/data-by-emoji.json";
import { assert } from "../../../app/utils/assert";

const props = defineProps<{
  emoji: string;
}>();

defineEmits<{
  close: [];
}>();

function isEmoji(emoji: string): emoji is keyof typeof emoteDataByEmoji {
  return emoji in emoteDataByEmoji;
}

const emojiData = computed(() => {
  assert.ok(
    isEmoji(props.emoji),
    `Provided emoji, ${props.emoji} is not in emojis record`,
  );
  return emoteDataByEmoji[props.emoji];
});
</script>
