<template>
  <header class="navbar h-8 border-b border-b-base-300 p-1">
    <nav class="contents">
      <ul class="contents">
        <li
          class="border-2 border-neutral bg-secondary p-1 text-5xl font-bold text-base-content"
        >
          <nuxt-link class="text-5xl leading-3" to="/"> pastbl </nuxt-link>
        </li>
        <li class="ml-2">
          <nuxt-link class="btn btn-primary" to="/emote-collections">
            collections
          </nuxt-link>
        </li>
        <li class="ml-auto">
          <button
            class="btn btn-secondary border-2 border-base-content text-base-content"
            data-toggle-theme="light,dark"
            data-act-class="ACTIVECLASS"
          >
            toggle theme
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { themeChange } from "theme-change";
// TODO: use cookie instead of session storage
// NOTE: theme-change does not provide cookie save, only session

onMounted(() => {
  themeChange(false);
  document.documentElement.classList.remove("dark", "light");
});
</script>
