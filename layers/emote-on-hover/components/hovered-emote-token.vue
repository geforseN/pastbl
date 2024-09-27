<template>
  <nuxt-link
    v-if="emote.integrationLink.canBe()"
    external
    target="_blank"
    :href="emote.integrationLink.value"
    class="link underline-offset-2 font-bold"
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
<script setup>
defineProps<{
  emote: InstanceType<typeof EmoteOnHover>;
}>();
</script>
