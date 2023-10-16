<template>
  <section
    class="flex flex-col divide-y-2 divide-ffz border-2 border-ffz bg-[#222222] p-2 text-white"
  >
    <emote-collection-header
      :is-loading="ffz.isLoading.value || ffzRoom.isLoading.value"
      :is-ready="ffz.isReady.value && ffzRoom.isReady.value"
      :is-error="!!(ffz.error.value || ffzRoom.error.value)"
    >
      <h3>FrankerFaceZ</h3>
      <template #collection-logo>
        <icons-ffz-logo class="max-h-[32px]" height="32" />
      </template>
    </emote-collection-header>
    <template v-if="ffz.error.value">
      <div class="p-1">
        {{ ffz.error.value }}
      </div>
    </template>
    <template v-if="ffz.isLoading.value">
      <div class="relative">
        <div class="p-1">Loading</div>
        <div class="absolute inset-0 w-full animate-pulse bg-slate-500/20">
          <span class="invisible">Loading</span>
        </div>
      </div>
    </template>
    <main
      v-if="ffzRoom.isReady.value && ffzRoom.state.value && !ffz.error.value"
    >
      <emote-collections-ffz-sets
        class="mt-1 flex flex-col gap-1"
        :sets="Object.values(ffzRoom.state.value.sets)"
        :maxEmoticons="ffz.state.value?.user.max_emoticons"
      />
    </main>
    <div class="animate-pulse" v-if="ffzRoom.isLoading.value">
      Loading emote sets
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { FFZ, FFZRoom } from "~/composables/useAsyncEmoteSets";

defineProps<{ ffz: FFZ; ffzRoom: FFZRoom }>();
</script>
