<template>
  <div class="relative grid grid-rows-layout">
    <top-nav @find-pasta-button-clicked="$router.push('/find-my-pasta')" />
    <slot />
    <bottom-nav @find-pasta-button-clicked="$router.push('/find-my-pasta')" />
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
</script>
