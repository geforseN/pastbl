<template>
  <section
    class="flex flex-col divide-y-2 divide-[#2599cd] border-2 border-[#2599cd] bg-[#181d1f] p-2 text-white"
  >
    <emote-collection-header
      :is-loading="seventv.isLoading.value"
      :is-ready="seventv.isReady.value"
      :is-error="!!seventv.error.value"
    >
      <h3>SevenTV</h3>
      <template #collection-logo>
        <icons-seventv-logo class="max-h-[32px]" height="32" />
      </template>
    </emote-collection-header>
    <main class="pt-1" v-if="seventv.isReady.value && seventv.state.value">
      <emote-collection-seventv-sets
        v-for="set of [seventv.state.value.emote_set]"
        :key="set.id"
        :emote-set="set.emotes"
        :emote-set-name="set.name"
        :capacity="set.capacity"
      ></emote-collection-seventv-sets>
    </main>
  </section>
  <section v-if="seventv.error.value">
    <h3>ERROR</h3>
    {{ seventv.error.value }}
  </section>
</template>

<script lang="ts" setup>
import type { SevenTV, SevenTVSet } from "~/composables/useAsyncEmoteSets";

defineProps<{ seventv: SevenTV; seventvSet: SevenTVSet }>();
</script>
