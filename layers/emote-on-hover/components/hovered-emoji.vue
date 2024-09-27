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
<script setup>
import emoteDataByEmoji from "unicode-emoji-json/data-by-emoji.json";

const props = defineProps<{
  emoji: string;
}>();

defineEmits<{
  close: [];
}>();

const emojiData = computed(() => emoteDataByEmoji[props.emoji]);
</script>
