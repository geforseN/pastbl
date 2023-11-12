<template>
  <li
    class="flex flex-col divide-y-2 divide-ffz border-2 border-ffz bg-[#222222] p-2 text-white"
  >
    <emote-collection-header
      :is-loading="ffz.fullCollection.isLoading.value"
      :is-ready="ffz.fullCollection.isReady.value"
      :is-error="!!ffz.fullCollection.error.value"
    >
      <h3>FrankerFaceZ</h3>
      <template #collection-logo>
        <icon-ffz-logo class="max-h-[32px]" height="32" />
      </template>
    </emote-collection-header>
    <template v-if="ffz.fullCollection.error.value">
      <div class="p-1">
        {{ ffz.fullCollection.error.value }}
      </div>
    </template>
    <template v-if="ffz.partialCollection.isLoading.value">
      <div class="relative">
        <div class="p-1">Loading</div>
        <div class="absolute inset-0 w-full animate-pulse bg-slate-500/20">
          <span class="invisible">Loading</span>
        </div>
      </div>
    </template>
    <emote-collection-ffz-sets
      v-if="
        ffz.sets.isReady.value && ffz.sets.state.value && !ffz.sets.error.value
      "
      class="flex flex-col gap-1 pt-1"
      :sets="ffz.sets.state.value"
      :capacity="ffz.partialCollection.state.value?.capacity"
    />
    <div v-if="ffz.sets.isLoading.value" class="animate-pulse">
      Loading emote sets
    </div>
  </li>
</template>
<script lang="ts" setup>
defineProps<{ ffz: UseFFZReturn }>();
</script>
