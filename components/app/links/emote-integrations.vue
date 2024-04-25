<template>
  <nuxt-link-locale
    class="btn btn-outline flex-nowrap text-wrap border-twitch-accent bg-base-100 text-twitch-accent"
    to="/collections"
  >
    <strong>{{ $t("collections.index.link") }}</strong>
    <emote-integration-logos class="min-w-8" />
  </nuxt-link-locale>
</template>
