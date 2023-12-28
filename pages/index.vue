<template>
  <div class="flex flex-col gap-2">
    <pasta-form-collapse />
    <div class="rounded-box border-2 px-4 py-2">
      <nuxt-link
        class="flex items-center justify-between gap-2 text-3xl font-bold"
        to="/pastas/find#pasta-search-parameters-heading"
      >
        <span class="flex items-center gap-2">
          <icon name="carbon:link" />
          Find pasta
        </span>
        🔍
      </nuxt-link>
    </div>
    <div class="rounded-box border-2 px-4 py-2">
      <nuxt-link to="/user/settings#user-settings-heading">
        <span
          class="flex items-center justify-between gap-2 text-3xl font-bold"
        >
          <span class="flex items-center gap-2">
            <icon name="carbon:link" />
            Change settings
          </span>
          ⚙️
        </span>
      </nuxt-link>
    </div>
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
  </div>
</template>
<style>
html,
body {
  scrollbar-gutter: stable;
}
</style>
