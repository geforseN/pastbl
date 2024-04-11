<template>
  <div
    class="mt-2 flex flex-col-reverse items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <!-- NOTE: for below component w-full and max-w-[414px] is necessary for no layout shift -->
    <find-my-pasta-list class="w-full max-w-[414px]" />
    <div class="w-96 space-y-2">
      <find-my-pasta-params />
      <app-page-link-main />
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: false,
});
</script>
