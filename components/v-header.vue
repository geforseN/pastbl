<template>
  <header class="navbar p-0 h-8 justify-between border-b border-b-base-300">
    <span
      class="bg-secondary p-2 font-bold text-5xl h-full border-2 border-neutral"
    >
      pastbl
    </span>
    <input placeholder="Your Nickname" class="placeholder:text-lg placeholder:text-neutral-50 input bg-secondary" v-model="userStore.user.nickname" />
    <button
      class="btn btn-secondary justify-self-end border-4 border-neutral mr-2 text-base"
      data-toggle-theme="emerald,emerald-dark"
      data-act-class="ACTIVECLASS"
    >
      toggle theme
    </button>
  </header>
</template>

<script setup lang="ts">
import { themeChange } from "theme-change";
import { useUserStore } from "~/store/user.store";
// FIXME: when theme is 'emerald-dark' on page refresh there is FOUC (from 'emerald' to 'emerald-dark')
// NOTE: to fix it should add data-theme="emerald-dark" to index.html <html>
// TODO: use cookie instead of session storage
// NOTE: theme-change does not provide cookie save, only session
onMounted(() => themeChange(false));
const userStore = useUserStore()
</script>
