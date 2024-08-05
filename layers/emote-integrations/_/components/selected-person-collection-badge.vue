<template>
  <div class="flex w-fit gap-1 rounded-btn border border-twitch-accent p-1">
    <twitch-user-avatar :twitch :size="24" />
    <person-emotes-collection-link
      class="link line-clamp-1 break-all font-bold"
      :login="twitch.login"
    >
      {{ twitch.nickname }}
    </person-emotes-collection-link>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  twitch: PersonTwitch;
}>();
</script>
