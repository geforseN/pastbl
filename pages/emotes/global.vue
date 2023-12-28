<template>
  <div class="flex w-96 flex-col gap-2">
    <global-emotes />
    <div class="rounded-box border-2 px-4 py-2">
      <nuxt-link to="/emotes">
        <span
          class="flex items-center justify-between gap-2 text-3xl font-bold"
        >
          <span class="flex items-center gap-2">
            <icon name="carbon:link" />
            Look for emotes
          </span>
          <emote-integration-logo-square />
        </span>
      </nuxt-link>
    </div>
    <go-to-main-page />
  </div>
</template>
