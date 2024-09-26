<template>
  <nuxt-link-locale :to="`/collections/persons/${login}`">
    <slot />
  </nuxt-link-locale>
</template>
<script setup>
defineProps<{
  login: TwitchUserLogin;
}>();
</script>
