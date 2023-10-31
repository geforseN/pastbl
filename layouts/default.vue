<template>
  <div class="relative grid grid-rows-layout">
    <top-nav />
    <slot />
    <nav
      class="btm-nav flex-row gap-x-2 border-t-2 border-t-primary px-2 md:hidden"
    >
      <ol class="contents">
        <li class="w-full">
          <nuxt-link
            class="btn btn-secondary w-full bg-secondary/10 text-secondary hover:bg-secondary/20"
            to="/collections"
          >
            load emotes
          </nuxt-link>
        </li>
        <li class="w-full">
          <button
            class="btn btn-info w-full bg-info/10 text-info hover:bg-info/20"
            for="search-pasta"
            @click="openFindPastaModal"
          >
            Find Pasta
          </button>
        </li>
      </ol>
    </nav>
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
// TODO: add logic fro openFindPastaModal
function openFindPastaModal() {
  return "TODO";
}
</script>
