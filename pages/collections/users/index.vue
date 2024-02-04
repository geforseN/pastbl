<template>
  <div class="flex w-96 flex-col gap-2">
    <user-collection-chip-list />
    <app-page-link to="emotes">
      <template #right><emote-integration-logos /></template>
    </app-page-link>
    <app-page-link to="main" />
  </div>
</template>
<script lang="ts" setup></script>
