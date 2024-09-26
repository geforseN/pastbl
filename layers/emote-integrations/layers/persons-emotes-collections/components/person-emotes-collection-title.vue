<template>
  <nuxt-link-locale
    class="rounded-lg focus:no-underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch-accent"
    :to="`https://twitch.tv/${twitch.login}`"
    :title="twitch.nickname"
  >
    <span
      class="link inline-block text-2xl font-bold decoration-twitch-accent underline-offset-4"
    >
      {{ twitch.nickname }}
    </span>
  </nuxt-link-locale>
</template>
<script setup>
defineProps<{
  twitch: Pick<PersonTwitch, "login" | "nickname">;
}>();
</script>
