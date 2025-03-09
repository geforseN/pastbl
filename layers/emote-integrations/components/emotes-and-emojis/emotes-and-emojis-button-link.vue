<template>
  <nuxt-link-locale
    class="btn btn-outline border-twitch-accent bg-base-100 text-twitch-accent flex-nowrap text-wrap"
    to="/collections"
  >
    <strong>{{ $t("emotesAndEmojis") }}</strong>
    <emote-integration-logos class="min-w-8" />
  </nuxt-link-locale>
</template>
