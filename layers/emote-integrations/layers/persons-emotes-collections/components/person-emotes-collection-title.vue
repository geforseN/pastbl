<template>
  <nuxt-link-locale
    class="focus:outline-twitch-accent rounded-lg focus:no-underline focus:outline focus:outline-2 focus:outline-offset-2"
    :to="`https://twitch.tv/${twitch.login}`"
    :title="twitch.nickname"
  >
    <span
      class="link decoration-twitch-accent inline-block text-2xl font-bold underline-offset-4"
    >
      {{ twitch.nickname }}
    </span>
  </nuxt-link-locale>
</template>
<script setup lang="ts">
defineProps<{
  twitch: Pick<PersonTwitch, "login" | "nickname">;
}>();
</script>
