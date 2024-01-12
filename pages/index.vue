<template>
  <div class="flex flex-col gap-2">
    <pasta-form-collapse />
    <app-page-link to="find-pasta">
      <template #right>🔍</template>
    </app-page-link>
    <app-page-link to="user-settings">
      <template #right>⚙️</template>
    </app-page-link>
    <app-page-link to="emotes">
      <template #right><emote-integration-logo-square /></template>
    </app-page-link>
  </div>
</template>
<style>
html,
body {
  scrollbar-gutter: stable;
}
</style>
