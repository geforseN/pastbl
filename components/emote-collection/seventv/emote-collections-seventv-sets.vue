<template>
  <div class="collapse-arrow collapse border border-ffz">
    <input
      v-model="isOpen"
      type="checkbox"
      @keypress.enter="isOpen = !isOpen"
    />
    <div class="collapse-title flex items-center">
      <div title="SevenTV emote set name">
        {{ props.emoteSetName }}
      </div>
      <div class="ml-auto text-sm">
        {{ props.emoteSet.length + ` / ${props.capacity}` }}
        emotes
      </div>
    </div>
    <div
      class="border-seventv collapse-content max-h-60 overflow-y-scroll"
      tabindex="0"
    >
      <img
        class="hover:outline-seventv mx-1 my-0.5 inline-block hover:scale-110 hover:outline hover:outline-1"
        v-for="emote of props.emoteSet"
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
  </div>
</template>

<script lang="ts" setup>
import { __SevenTV__UserCollectionEmote__ } from "~/integrations/SevenTV/SevenTV.api";

const isOpen = defineModel("isOpen", { local: true, type: Boolean });

const props = defineProps<{
  emoteSet: __SevenTV__UserCollectionEmote__[];
  emoteSetName: string;
  capacity: number;
}>();
</script>

<style></style>
