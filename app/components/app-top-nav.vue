<template>
  <nav class="navbar border-b-2 border-b-secondary/50 p-1">
    <ul class="contents space-x-2">
      <li
        class="bg-hero-graph-paper border-2 border-neutral bg-secondary/95 p-1 text-5xl font-bold text-base-content"
      >
        <nuxt-link-locale
          class="pastbl__logo relative bottom-px text-5xl"
          to="/"
        >
          pastbl
        </nuxt-link-locale>
      </li>
      <li class="hidden go-brr:block">
        <emotes-and-emojis-button-link />
      </li>
      <li class="hidden xl:block">
        <pastas-find-button-link />
      </li>
      <li class="hidden xl:block">
        <settings-button-link />
      </li>
      <li class="!ml-auto hidden go-brr:block" />
      <li class="hidden sm:block">
        <app-locale-select />
      </li>
      <li class="hidden sm:block">
        <app-theme-select />
      </li>
      <li class="!ml-auto go-brr:hidden" />
      <li class="hidden min-[380px]:block">
        <auth-logged-in-dropdown
          v-if="userSession.loggedIn && userSession.user"
          class="bg-base-100"
          :user="userSession.user"
          @logout="userSession.clear"
        />
        <auth-twitch-login-link-button v-else />
      </li>
      <li class="xl:hidden">
        <app-drawer-burger-button />
      </li>
    </ul>
  </nav>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { useUserSession } from "../../node_modules//nuxt-auth-utils@0@0@4/node_modules/nuxt-auth-utils/dist/runtime/app/composables/session";

const userSession = reactive(useUserSession());
</script>
<style scoped>
strong {
  font-weight: inherit;
}

.router-link-active strong {
  @apply underline decoration-2 underline-offset-2;
}

.pastbl__logo {
  -webkit-text-stroke: 2px theme(colors.base-100);
}
</style>
