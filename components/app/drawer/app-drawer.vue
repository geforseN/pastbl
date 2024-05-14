<template>
  <div class="drawer drawer-end">
    <input id="app-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <slot />
    </div>
    <div class="drawer-side" v-bind="$attrs">
      <label
        for="app-drawer"
        aria-label="close sidebar"
        class="drawer-overlay"
      />
      <ul
        class="menu min-h-full w-80 space-y-2 bg-base-100 p-4 pt-1 text-base-content"
      >
        <li class="mt-1">
          <label
            for="app-drawer"
            aria-label="close sidebar"
            class="btn btn-square btn-error drawer-button ml-auto"
          >
            <icon name="ic:sharp-close" />
          </label>
        </li>
        <li>
          <auth-logged-in-dropdown
            v-if="userSession.loggedIn && userSession.user"
            class="border bg-base-100"
            :user="userSession.user"
            @logout="userSession.clear"
          />
          <auth-twitch-login-link-button class="w-full" v-else />
        </li>
        <li>
          <app-links-emote-integrations />
        </li>
        <li>
          <app-links-pastas-find />
        </li>
        <li>
          <app-links-user-settings />
        </li>
        <div class="!mt-auto mr-auto space-y-4">
          <app-theme-select />
          <app-locale-select />
        </div>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
const userSession = reactive(useUserSession());
</script>
