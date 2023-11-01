<template>
  <div class="relative grid grid-rows-layout">
    <top-nav />
    <slot />
    <nav class="btm-nav btm-nav-md flex-row gap-0 md:hidden">
      <ol class="contents">
        <li class="w-full grow">
          <nuxt-link
            class="btn btn-secondary h-16 w-full rounded-none border-0 bg-secondary/10 text-secondary hover:bg-secondary/20 hover:underline focus:underline"
            to="/collections"
            active-class=" border-t-2 border-t-secondary"
          >
            load emotes
          </nuxt-link>
        </li>
        <li class="w-full">
          <button
            class="btn btn-info h-16 w-full rounded-none border-0 bg-info/10 text-info hover:bg-info/20"
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
