<template>
  <section
    class="border-2 bg-[#1c2225] p-2 text-white"
    v-if="seventv.isReady.value || seventv.isLoading.value"
  >
    <div class="flex items-center justify-between py-1 pl-1">
      <h3 class="text-xl font-medium">SevenTV</h3>
      <icons-seventv-logo width="32" height="32" />
    </div>
    <template v-if="seventv.isReady.value && seventv.state.value">
      <div class="p-1" title="FrankerFaceZ emote set name">
        {{ seventv.state.value.emote_set.name }}
      </div>
      <div
        class="border-seventv h-48 max-h-96 min-h-[8rem] resize-y overflow-y-auto border p-1"
      >
        <img
          class="hover:outline-seventv mx-1 my-0.5 inline-block hover:scale-110 hover:outline hover:outline-1"
          v-for="emote of seventv.state.value.emote_set.emotes"
          :key="emote.id"
          :src="`https:${emote.data.host.url}/1x.webp`"
          loading="lazy"
          :title="emote.name"
          :alt="emote.name + ' SevenTV emote'"
          @error.prevent="
            (event) => {
              event.preventDefault();
              console.log(event);
            }
          "
        />
      </div>
    </template>
  </section>
  <section v-else-if="seventv.error.value">
    <h3>ERROR</h3>
    {{ seventv.error.value }}
  </section>
</template>

<script lang="ts" setup>
import { SevenTVReturn } from "./emote-collections.vue";

defineProps<{ seventv: SevenTVReturn }>();
</script>
