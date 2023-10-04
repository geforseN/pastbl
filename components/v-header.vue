<template>
  <header class="navbar h-8 justify-between border-b border-b-base-300 p-0">
    <span
      class="h-full border-2 border-neutral bg-secondary p-2 text-5xl font-bold"
    >
      pastbl
    </span>
    <button
      class="btn btn-secondary mr-2 justify-self-end border-4 border-neutral text-base"
      data-toggle-theme="light,dark"
      data-act-class="ACTIVECLASS"
    >
      toggle theme
    </button>
  </header>
</template>

<script setup lang="ts">
import { themeChange } from "theme-change";
// FIXME: when theme is 'emerald-dark' on page refresh there is FOUC (from 'emerald' to 'emerald-dark')
// NOTE: to fix it should add data-theme="emerald-dark" to index.html <html>
// TODO: use cookie instead of session storage
// NOTE: theme-change does not provide cookie save, only session
onMounted(() => themeChange(false));

const colorMode = useColorMode();

console.log(colorMode);

onMounted(() => {
  document.documentElement.classList.remove("dark", "light");
});
</script>
