<template>
  <app-page-link to="emotes">
    <template #right>
      <div class="flex translate-x-0.5 items-center gap-2">
        <span class="inline-flex flex-nowrap items-baseline text-xs">
          <kbd class="kbd pt-1">Alt</kbd>
          <span class="mx-0.5">+</span>
          <kbd class="kbd pt-1">E</kbd>
        </span>
        <emote-integration-logos class="min-w-8" />
      </div>
    </template>
  </app-page-link>
</template>
