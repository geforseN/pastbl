<template>
  <div
    ref="container"
    data-testid="emote-on-hover-card"
    class="absolute z-50 flex"
    :class="emote && emoteModifiers?.length && 'items-end'"
  >
    <hovered-emote
      v-if="emote"
      :emote
      :class="[emoteModifiers?.length && 'rounded-br-none']"
      @close="$emit('close')"
    />
    <hovered-emote-modifiers
      v-if="emoteModifiers?.length"
      :emote-modifiers
    />
    <hovered-emoji
      v-if="emoji"
      :emoji
      @close="$emit('close')"
    />
  </div>
</template>
<script setup lang="ts">
defineProps<{
  emote?: Nullish<IEmote>;
  emoji?: Nullish<string>;
  emoteModifiers?: Nullish<IEmote[]>;
}>();

defineEmits<{
  close: [];
}>();

const containerRef = useTemplateRef("container");

defineExpose({
  containerRef,
});
</script>
