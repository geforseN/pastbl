<template>
  <div class="relative grid grid-rows-layout">
    <top-nav @open-find-pasta-modal="openFindPastaModal" />
    <slot />
    <bottom-nav @open-find-pasta-modal="openFindPastaModal" />
    <u-notifications>
      <template #title="{ title }">
        <span class="text-xl">{{ title }}</span>
      </template>
      <template #description="{ description }">
        <span class="font-bold">{{ description }}</span>
      </template>
    </u-notifications>
  </div>
</template>
<script setup lang="ts">
import { themeChange } from "theme-change";

onMounted(() => {
  themeChange(false);
  document.documentElement.classList.remove("dark", "light");
});

// TODO
// TODO
// TODO: add logic fro openFindPastaModal
function openFindPastaModal() {
  return "TODO";
}
</script>
