<template>
  <nav class="navbar border-b-2 border-b-secondary/50 p-1">
    <ol class="contents">
      <li
        class="border-2 border-neutral bg-secondary/95 p-1 text-5xl font-bold text-base-content"
      >
        <nuxt-link class="relative bottom-[1px] text-5xl" to="/">
          pastbl
        </nuxt-link>
      </li>
      <li class="ml-2 hidden go-brr:block">
        <nuxt-link
          class="btn btn-outline border-twitch text-twitch"
          to="/collections"
        >
          load emotes
          <icons-ffz-logo class="max-h-[24px] text-xs" width="24" heigth="24" />
          <icons-bttv-logo width="24" heigth="24" />
          <icons-seventv-logo width="24" heigth="24" />
        </nuxt-link>
      </li>
      <li class="ml-2 hidden go-brr:block">
        <button class="btn btn-info" @click="emit('openFindPastaModal')">
          find pasta
          <icons-search width="24" heigth="24" />
        </button>
      </li>
      <li class="ml-auto">
        <select
          id="app-theme"
          class="select select-bordered"
          data-choose-theme
          name="select-app-theme"
        >
          <option value="">Default theme</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
const emit = defineEmits(["openFindPastaModal"]);
</script>
