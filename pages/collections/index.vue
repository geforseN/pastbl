<template>
  <div class="flex w-96 flex-col gap-2">
    <app-page-link to="emojis">
      <template #right>👀</template>
    </app-page-link>
    <app-page-link to="global-emotes">
      <template #right><emote-integration-logos /></template>
    </app-page-link>
    <app-page-link to="users-emotes">
      <template #right>
        <img
          class="translate-x-2"
          src="https://cdn.7tv.app/emote/63cec0c12ba67946677a463e/1x.webp"
          alt="buh emote from SevenTV"
          loading="lazy"
          width="45"
        />
      </template>
    </app-page-link>
    <user-collection-fetch />
    <user-collection-select />
    <app-page-link-main />
  </div>
</template>
