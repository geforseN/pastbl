<template>
  <nuxt-link-locale
    class="rounded-lg focus:no-underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch-accent"
    :to="`https://twitch.tv/${user.login}`"
    :title="user.nickname"
  >
    <span
      class="link inline-block text-2xl font-bold decoration-twitch-accent underline-offset-4"
    >
      {{ user.nickname }}
    </span>
  </nuxt-link-locale>
</template>
<script setup lang="ts">
defineProps<{
  user: Pick<TwitchUser, "login" | "nickname">;
}>();
</script>
