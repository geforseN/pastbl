<template>
  <nuxt-link-locale :to="`/collections/persons/${login}`">
    <slot />
  </nuxt-link-locale>
</template>
<script setup lang="ts">
defineProps<{
  login: TwitchUserLogin;
}>();
</script>
