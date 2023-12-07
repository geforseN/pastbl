<template>
  <div>
    <Head>
      <Link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <Link rel="manifest" href="/site.webmanifest" />
    </Head>
    <Body lang="en">
      <div class="relative grid grid-rows-layout">
        <top-nav />
        <nuxt-layout>
          <nuxt-page />
        </nuxt-layout>
        <bottom-nav />
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

useHead({ title: process.dev ? "pastbl - dev" : "pastbl" });

onMounted(() => {
  themeChange(false);
  document.documentElement.classList.remove("dark", "light");
});
</script>

<!-- 
  pages:
   - index: показывает все возможные действия, а  что именно смотри ниже  
     - pastas/create
     - pastas/edit/:pastaId
     - pastas/find?...MUST_BE_MANY_PARAMS_HERE
     - settings 

  слева будет постоянно список паст
  справа будет:
   - форма для создания пасты
   - форма для фильтрации паст 
   - настройки пользователя
   - все загруженные коллекции emotes (также там должен быть input для быстрой загрузки коллекции) 
   - по нажатию на кнопку 'Change pasta' n-ой пасты
     - форма для редактирования пасты 
 -->
