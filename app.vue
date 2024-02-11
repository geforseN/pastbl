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
        <app-top-nav />
        <nuxt-layout>
          <nuxt-page />
        </nuxt-layout>
        <app-bottom-nav />
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
useHead({ title: process.dev ? "pastbl - dev" : "pastbl" });

onMounted(() => {
  document.documentElement.classList.remove("dark", "light");
});
</script>
<style>
.emote {
  display: inline;
  margin: -5px 0;
}
</style>
