<template>
  <div class="flex w-96 flex-col gap-2">
    <app-page-link to="emojis">
      <template #right>👀</template>
    </app-page-link>
    <app-page-link to="global-emotes">
      <template #right><emote-integration-logos /></template>
    </app-page-link>
    <user-collection-btnlike-list />
    <user-collection-fetch />
    <user-collection-select />
    <app-page-link to="main" />
  </div>
</template>
