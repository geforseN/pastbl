<template>
  <!-- class="flex items-center h-asd min-w-asd" -->
  <div class="flex">
    <nuxt-link-locale
      :to="`https://twitch.tv/${user.login}`"
      class="rounded-full border border-twitch-accent focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch-accent"
    >
      <img
        class="rounded-full bg-twitch-accent/20"
        :width="size"
        :height="size"
        :src="user.avatarUrl"
        :alt="$t('avatar.alt', { nickname: user.nickname })"
      />
    </nuxt-link-locale>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  user: Pick<TwitchUser, "avatarUrl" | "login" | "nickname">;
  size: number;
}>();
</script>
