<template>
  <div class="relative grid grid-rows-layout">
    <top-nav @find-pasta-button-clicked="navigateTo('/find-my-pasta')" />
    <div
      class="mt-2 flex flex-col items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
    >
      <chat-pasta-list>
        <template #creatorData>
          <chat-pasta-creator-data
            :badges-count="userStore.user.badges.count"
            :nickname="userStore.user.nickname"
            :nickname-color="userStore.user.preferences.nickname.color"
          />
        </template>
      </chat-pasta-list>
      <slot />
    </div>
    <bottom-nav @find-pasta-button-clicked="navigateTo('/find-my-pasta')" />
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
const userStore = useUserStore();
onMounted(() => {
  themeChange(false);
  document.documentElement.classList.remove("dark", "light");
});
</script>
