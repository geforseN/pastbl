<template>
  <a
    href="/api/v1/auth/twitch"
    class="group btn btn-ghost flex-nowrap bg-twitch-accent text-base-300"
  >
    <span
      class="text-lg/1 group-hover:underline group-hover:decoration-2 group-hover:underline-offset-2"
    >
      {{ $t("account.loginWithTwitch") }}
    </span>
    <emote-integration-logo source="Twitch" class="h-6 w-6 translate-y-0.5" />
  </a>
</template>
