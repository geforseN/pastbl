<template>
  <div class="flex w-fit gap-1 rounded-btn border border-twitch-accent p-1">
    <twitch-user-avatar :user="twitch" :size="24" />
    <nuxt-link-locale
      :to="`/collections/users/${twitch.login}`"
      class="link line-clamp-1 break-all font-bold"
    >
      {{ twitch.nickname }}
    </nuxt-link-locale>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  twitch: PersonTwitch;
}>();
</script>
