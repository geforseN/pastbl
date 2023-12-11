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
          class="btn btn-outline border-twitch text-lg text-twitch"
          to="/emotes"
        >
          emotes
          <icon-emote-integration-logo
            v-for="source of [
              'FrankerFaceZ',
              'BetterTTV',
              'SevenTV',
            ] satisfies AvailableEmoteSource[]"
            v-once
            :key="source"
            :source="source"
            width="24"
            height="24"
            class="max-h-[24px] text-xs"
          />
        </nuxt-link>
      </li>
      <li class="ml-2 hidden go-brr:block">
        <nuxt-link class="btn btn-info text-lg" to="/pastas/find">
          find pasta
          <span>🔍</span>
        </nuxt-link>
      </li>
      <li class="ml-2 hidden go-brr:block">
        <nuxt-link
          to="/user/settings#user-settings-heading"
          class="btn btn-neutral text-lg"
        >
          settings
          <span>⚙️</span>
        </nuxt-link>
      </li>
      <li class="ml-auto">
        <select
          id="app-theme"
          class="select select-bordered text-base"
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
import type { AvailableEmoteSource } from "~/integrations";
</script>
