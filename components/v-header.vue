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
          <nuxt-link class="btn btn-primary text-black" to="/collections">
            load emotes
          </nuxt-link>
        </li>
        <li class="ml-2">
          <button class="btn btn-info">
            Find Own Pasta
            <icons-search />
          </button>
        </li>
        <li class="ml-auto">
          <select class="select select-bordered" data-choose-theme>
            <option value="">Default theme</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { themeChange } from "theme-change";

onMounted(() => {
  themeChange(false);
  document.documentElement.classList.remove("dark", "light");
});
</script>
