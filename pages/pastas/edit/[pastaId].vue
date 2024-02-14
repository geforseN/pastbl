<template>
  <div class="flex flex-col gap-2">
    <chat-pasta-edit />
    <app-page-link to="find-pasta">
      <template #right>🔍</template>
    </app-page-link>
    <app-page-link to="user-settings">
      <template #right>⚙️</template>
    </app-page-link>
    <app-page-link to="emotes">
      <template #right><emote-integration-logos /></template>
    </app-page-link>
    <app-page-link to="main" />
  </div>
</template>
