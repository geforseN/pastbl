<template>
  <main class="flex flex-col gap-1">
    <emote-collection-collapsed-set
      class="border-2 border-[#2599cd]"
      v-for="set of props.sets"
      :key="set.id"
      :set="set"
    >
      <template #title>
        <div class="flex items-baseline justify-between">
          <h3 title="SevenTV emote set name">
            {{ set.name }}
          </h3>
          <span class="text-sm">
            {{ set.emotes.length + ` / ${set.capacity}` }}
            emotes
          </span>
        </div>
      </template>
      <template #emoteList>
        <div
          class="flex max-h-60 flex-wrap gap-1 overflow-y-auto border-t-2 border-[#2599cd] p-2"
          tabindex="0"
        >
          <div
            class="flex h-8 min-w-[2rem] flex-col items-center justify-center bg-[#2599cd]/20"
            v-for="emote of set.emotes"
            :key="emote.id"
          >
            <img
              class="mx-1 my-0.5 inline-block hover:scale-110 hover:outline hover:outline-1 hover:outline-[#2599cd]"
              :src="`https:${emote.data.host.url}/1x.webp`"
              :width="emote.data.host.files[1].width"
              loading="lazy"
              :title="emote.name"
              :alt="emote.name"
              @error.prevent="
                (event) => {
                  event.preventDefault();
                  console.log(event);
                }
              "
            />
          </div>
        </div>
      </template>
    </emote-collection-collapsed-set>
  </main>
</template>

<script lang="ts" setup>
import type { __SevenTV__UserSetEmote__ } from "~/integrations/SevenTV/SevenTV.api";

const props = defineProps<{
  sets: {
    emotes: __SevenTV__UserSetEmote__[];
    name: string;
    capacity: number;
    id: string;
  }[];
}>();
</script>

<style></style>
