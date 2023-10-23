<template>
  <li
    class="flex flex-col divide-y-2 divide-[#2599cd] border-2 border-[#2599cd] bg-[#181d1f] p-2 text-white"
  >
    <emote-collection-header
      :is-loading="seventv.isLoading.value || seventvSet.isLoading.value"
      :is-ready="seventv.isReady.value && seventvSet.isReady.value"
      :is-error="!!seventv.error.value || !!seventvSet.error.value"
    >
      <h3>SevenTV</h3>
      <template #collection-logo>
        <icons-seventv-logo class="max-h-[32px]" height="32" />
      </template>
    </emote-collection-header>
    <emote-collection-seventv-sets
      class="pt-1"
      v-if="
        seventv.isReady.value &&
        seventv.state.value &&
        seventvSet.state.value?.emotes
      "
      :sets="[seventvSet.state.value]"
    />
    <template v-if="seventv.error.value">
      {{ seventv.error.value }}
    </template>
  </li>
</template>
<script lang="ts" setup>
defineProps<{ seventv: SevenTVAsyncState; seventvSet: SevenTVSetAsyncState }>();
</script>
