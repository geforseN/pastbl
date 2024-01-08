<template>
  <img
    :src="props.emote.url + '/1'"
    :alt="props.emote.token"
    :title="props.emote.token"
    :width="props.emote.width"
    height="32"
    class="m-0.5"
    loading="lazy"
  />
</template>
<script lang="ts" setup>
const props = defineProps<{
  emote: import("~/integrations").FrankerFaceZEmote;
}>();
</script>
