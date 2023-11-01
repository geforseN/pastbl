<template>
  <li
    class="flex flex-col divide-y-2 divide-[#63b3ed] border-2 border-[#63b3ed] bg-[#1a202c] p-2 text-white"
  >
    <emote-collection-header
      :is-loading="bttv.isLoading.value"
      :is-ready="bttv.isReady.value"
      :is-error="!!bttv.error.value"
    >
      <h3>BetterTTV</h3>
      <template #collection-logo>
        <icons-bttv-logo class="max-h-[32px]" height="32" />
      </template>
    </emote-collection-header>
    <emote-collection-bttv-sets
      v-if="bttv.isReady.value && bttv.state.value"
      class="pt-1"
      :sets="bttv.state.value.sets"
    />
    <template v-if="bttv.isLoading.value">
      <div class="relative w-full">
        <div class="absolute inset-0 mt-1 animate-pulse bg-slate-500/20">
          <span class="invisible">Loading</span>
        </div>
        <span>Loading</span>
      </div>
    </template>
    <template v-if="bttv.error.value">{{ bttv.error.value }}</template>
  </li>
</template>
<script lang="ts" setup>
defineProps<{ bttv: UseBTTVReturn }>();
</script>
