<template>
  <div
    class="mt-2 flex flex-col-reverse items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <!-- NOTE: for below component w-full and max-w-[414px] is necessary for no layout shift -->
    <pastas-find-list class="w-full max-w-[414px]" />
    <div class="w-96 space-y-2">
      <pastas-find-params />
      <app-link-to-main />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useHead } from "@unhead/vue";
import { definePageMeta } from "../../../../../../node_modules//nuxt@3@parcel+watcher@2@types+node@22-orm@0@types+react@18/node_modules/nuxt/dist/pages/runtime/composables";

definePageMeta({
  layout: false,
});

useHead({
  title: "Find Pastas",
});
</script>
