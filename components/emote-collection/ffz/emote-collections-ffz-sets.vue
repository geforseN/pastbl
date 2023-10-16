<template>
  <div>
    <div v-for="set of props.sets">
      <div class="collapse-arrow collapse border border-ffz">
        <input
          v-model="isOpen"
          type="checkbox"
          @keypress.enter="isOpen = !isOpen"
        />
        <div class="collapse-title flex items-center">
          <div title="FrankerFaceZ emote set name">
            {{ set.title }}
          </div>
          <div class="ml-auto text-sm">
            {{ set.emoticons.length }}
            {{ props.maxEmoticons !== undefined && ` / ${props.maxEmoticons}` }}
            emotes
          </div>
        </div>
        <div
          class="collapse-content max-h-60 overflow-y-scroll border-t"
          tabindex="0"
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
  </div>
</template>

<script lang="ts" setup>
import type { fetchFFZUserRoomByTwitchId } from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";

const isOpen = defineModel("isOpen", { local: true, type: Boolean });
const props = defineProps<{
  sets: Awaited<ReturnType<typeof fetchFFZUserRoomByTwitchId>>["sets"];
  maxEmoticons?: number;
}>();
</script>

<style></style>
