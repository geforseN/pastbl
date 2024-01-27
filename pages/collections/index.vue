<template>
  <div class="flex w-96 flex-col gap-2">
    <app-page-link to="emojis">
      <template #right>👀</template>
    </app-page-link>
    <app-page-link to="global-emotes">
      <template #right><emote-integration-logo-square /></template>
    </app-page-link>
    <user-emote-collections />
    <fetch-emote-collection />
    <select-user-collection />
    <app-page-link to="main" />
  </div>
</template>
