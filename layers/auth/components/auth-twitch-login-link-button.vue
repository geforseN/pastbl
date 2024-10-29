<template>
  <nuxt-link
    to="/auth/twitch"
    target="_blank"
    data-testid="auth-twitch-login-link-button"
    class="group btn btn-ghost w-fit flex-nowrap bg-twitch-accent text-base-300 xs:w-auto"
  >
    <span
      class="text-lg/1 group-hover:underline group-hover:decoration-2 group-hover:underline-offset-2"
    >
      {{ $t("loginWithTwitch") }}
    </span>
    <emote-integration-logo
      source="Twitch"
      class="size-6 translate-y-0.5"
    />
  </nuxt-link>
</template>
