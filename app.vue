<template>
  <div>
    <Head>
      <Title>pastbl</Title>
    </Head>
    <Body lang="en">
      <div class="relative grid grid-rows-layout">
        <top-nav @find-pasta-button-clicked="navigateTo('/find-my-pasta')" />
        <nuxt-layout>
          <nuxt-page />
        </nuxt-layout>
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
    </Body>
  </div>
</template>
<script setup lang="ts">
import { themeChange } from "theme-change";

onMounted(() => {
  themeChange(false);
  document.documentElement.classList.remove("dark", "light");
});
</script>
