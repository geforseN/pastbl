<template>
  <h2 class="text-3xl font-bold border-b p-1">
    Create pasta
    <!-- TODO onhover change img to basedge, xdd, aRolf ... -->
    <div class="relative inline-block">
      <img
        class="inline ml-1"
        src="https://cdn.7tv.app/emote/6306876cbe8c19d70f9d6b22/1x.webp"
        alt="Jokerge emote"
        @mouseover="shouldShowDisgustingAlert = true"
        @mouseout="shouldShowDisgustingAlert = false"
      />
      <img
        class="pointer-events-none absolute right-0 bottom-0 scale-150 -translate-y-1 -translate-x-[2.5px] motion-reduce:hidden"
        src="https://cdn.7tv.app/emote/6216d2f73808dfe5c465bc4a/1x.webp"
        alt="Alert emote"
        :hidden="!shouldShowDisgustingAlert"
      />
    </div>
  </h2>
</template>
<script setup lang="ts">
const shouldShowDisgustingAlert = ref(true);

onMounted(() => {
  setTimeout(() => {
    shouldShowDisgustingAlert.value = false;
  }, 3_000);
});
</script>
