<template>
  <emote-collection-ffz-skeleton v-if="ffz.isLoading.value" />
  <section
    class="flex flex-col divide-y-2 divide-ffz border-2 bg-[#222222] p-2 text-white"
    v-else-if="ffz.isReady.value || ffz.isLoading.value"
  >
    <div class="flex items-center justify-between py-1 pl-1">
      <h3 class="text-xl font-medium">FrankerFaceZ</h3>
      <icons-ffz-logo class="max-h-[32px]" height="32" />
    </div>
    <template v-if="ffz.state.value">
      <div class="flex p-1">
        <template v-if="ffz.state.value.user.badges">
          <img
            class=""
            v-for="badge of Object.values(ffz.state.value.badges)"
            :style="{ backgroundColor: badge.color }"
            :src="badge.image"
            :alt="badge.title + 'badge'"
            :title="badge.title"
          />
        </template>
        <span class="ml-1">{{ ffz.state.value.user.display_name }}</span>
      </div>
    </template>
    <template v-else-if="ffz.isLoading">
      <div class="relative">
        <div class="p-1">Loading</div>
        <div class="absolute inset-0 w-full animate-pulse bg-slate-500/20">
          <span class="invisible">Loading</span>
        </div>
      </div>
    </template>
    <div v-if="ffzRoom.isReady.value && ffzRoom.state.value">
      <div class="py-1" v-for="set of Object.values(ffzRoom.state.value.sets)">
        <div class="p-1" title="FrankerFaceZ emote set name">
          {{ set.title }}
        </div>
        <div
          class="h-12 max-h-96 min-h-[8rem] resize-y overflow-y-auto border-2 border-ffz p-1"
        >
          <img
            class="mx-1 my-0.5 inline-block"
            v-for="emote of set.emoticons"
            :key="emote.id"
            :src="emote.urls[1]"
            loading="lazy"
            :title="emote.name"
            :alt="emote.name + ' emote'"
          />
        </div>
      </div>
    </div>
    <div class="animate-pulse" v-else-if="ffzRoom.isLoading.value">
      Loading emote sets
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { FFZReturn, FFZRoomReturn } from "./emote-collections.vue";

defineProps<{ ffz: FFZReturn; ffzRoom: FFZRoomReturn }>();
</script>
