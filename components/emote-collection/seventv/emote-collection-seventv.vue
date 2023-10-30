<template>
  <li
    class="flex flex-col divide-y-2 divide-[#2599cd] border-2 border-[#2599cd] bg-[#181d1f] p-2 text-white"
  >
    <emote-collection-header
      :is-loading="sevenTv.isLoading.value || sevenTvSet.isLoading.value"
      :is-ready="sevenTv.isReady.value && sevenTvSet.isReady.value"
      :is-error="!!sevenTv.error.value || !!sevenTvSet.error.value"
    >
      <h3>SevenTV</h3>
      <template #collection-logo>
        <icons-seventv-logo class="max-h-[32px]" height="32" />
      </template>
    </emote-collection-header>
    <emote-collection-seventv-sets
      v-if="
        sevenTv.isReady.value &&
        sevenTv.state.value &&
        sevenTvSet.state.value?.emotes
      "
      class="pt-1"
      :sets="[sevenTvSet.state.value]"
    />
    <template v-if="sevenTv.error.value">
      {{ sevenTv.error.value }}
    </template>
  </li>
</template>
<script lang="ts" setup>
defineProps<{ sevenTv: SevenTVAsyncState; sevenTvSet: SevenTVSetAsyncState }>();
</script>
