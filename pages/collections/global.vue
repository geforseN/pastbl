<template>
  <div class="flex w-96 flex-col gap-2">
    <global-emotes />
    <app-page-link to="emotes">
      <template #right><emote-integration-logo-square /></template>
    </app-page-link>
    <app-page-link to="main" />
  </div>
</template>
