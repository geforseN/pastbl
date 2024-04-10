<template>
  <app-page-link to="emotes">
    <template #right>
      <div class="flex translate-x-0.5 items-center gap-2">
        <combine-keyboard-keys first="Alt" last="E" />
        <emote-integration-logos class="min-w-8" />
      </div>
    </template>
  </app-page-link>
</template>
