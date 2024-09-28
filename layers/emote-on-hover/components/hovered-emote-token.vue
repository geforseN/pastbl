<template>
  <nuxt-link
    v-if="emote.integrationLink.canBe()"
    external
    target="_blank"
    :href="emote.integrationLink.value"
    class="link font-bold underline-offset-2"
  >
    {{ emote.token }}
  </nuxt-link>
  <span
    v-else
    class="font-bold"
  >
    {{ emote.token }}
  </span>
</template>
<script setup lang="ts">
defineProps<{
  emote: InstanceType<typeof EmoteOnHover>;
}>();
</script>
