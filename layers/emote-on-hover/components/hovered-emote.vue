<template>
  <div
    v-if="emote"
    class="flex max-w-xs flex-col items-center gap-1 rounded-lg border bg-base-100 p-2"
    :class="[
      styles!.backgroundBase,
    ]"
  >
    <emote-on-hover-card-close-button @click="$emit('close')" />
    <hovered-emote-images
      :class="styles!.scrollbar"
      :emote
    />
    <div
      class="flex flex-wrap justify-center gap-1 text-center text-base-content"
    >
      <hovered-emote-token :emote />
      <div>
        <emote-integration-logo
          :source="emote.source"
          width="20"
          class="inline h-min self-center"
        />
        {{ emote.source }}
      </div>
      <span class="inline-flex items-baseline text-base-content">
        {{ $t(`emote.${emote.type}`) }}
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
</template>
<script setup>
const props = defineProps<{
  emote: IEmote;
}>();

defineEmits<{
  close: [];
}>();

const emote = computed(() => EmoteOnHover.create(props.emote));

const styles = computed(
  () => emoteIntegrationsStyles[emote.value.source],
);
</script>
