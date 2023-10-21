<template>
  <main class="relative flex flex-col gap-1">
    <emote-collection-collapsed-set
      class="border-2 border-ffz"
      v-for="set of props.sets"
      :key="set.id"
      :set="set"
    >
      <template #title>
        <div class="flex items-baseline justify-between">
          <h3 title="FrankerFaceZ emote set name">
            {{ set.title }}
          </h3>
          <span class="text-sm">
            {{ set.emoticons.length }}
            <span v-if="props.maxEmoticons">
              {{ ` / ${props.maxEmoticons}` }}
            </span>
            emotes
          </span>
        </div>
        <div class="absolute bottom-10">
          {{ selectedEmote }}
          <img
            v-if="selectedEmote?.imgSrc"
            :src="selectedEmote.imgSrc"
            alt=""
          />
        </div>
      </template>
      <template #emoteList>
        <div
          class="flex max-h-60 flex-wrap gap-1 overflow-y-auto border-t-2 border-ffz p-2"
          tabindex="0"
          data-is-emotes-container="true"
          @mouseover="handleEmoteDataPopoverAdd"
          @mouseout="handleEmoteDataPopoverRemove"
        >
          <div
            class="flex h-8 min-w-[2rem] flex-col items-center justify-center bg-ffz/20"
            v-for="emote of set.emoticons"
            data-is-emote-container="true"
            :key="emote.id"
          >
            <img
              class="m-0.5"
              loading="lazy"
              :width="emote.width"
              :data-emote-name="emote.name"
              :data-emote-author-name="emote.artist?.name"
              :title="emote.name"
              :src="emote.urls[1]"
              :alt="emote.name"
            />
          </div>
        </div>
      </template>
    </emote-collection-collapsed-set>
  </main>
</template>

<script lang="ts" setup>
import type { fetchFFZUserRoomByTwitchId } from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";

const selectedEmote = ref<Record<string, any> | null>(null);

const emit = defineEmits(["setSelectedEmote", "clearSelectedEmote"]);

// FIXME: just use before pseudo attribute, content can have value of data attribute
function handleEmoteDataPopoverAdd(event: MouseEvent) {
  const overedElement = event.target;
  if (!(overedElement instanceof HTMLElement)) {
    return;
  }
  const isEmoteContainer = overedElement.closest("[data-is-emote-container]");
  if (!isEmoteContainer) {
    return;
  }
  const emoteImage = isEmoteContainer.firstChild;
  if (!(emoteImage instanceof HTMLImageElement)) {
    return;
  }
  const selectedEmoteName = emoteImage.dataset.emoteName;
  if (!selectedEmoteName) {
    throw new Error("no data-name on <img /> was defined");
  }
  selectedEmote.value = {
    name: selectedEmoteName,
    imgSrc: emoteImage.src,
    imgAlt: emoteImage.alt,
    authorName: emoteImage.dataset.emoteAuthorName,
  };
  emit("setSelectedEmote", selectedEmote.value);
}

function handleEmoteDataPopoverRemove(event: MouseEvent) {
  const outedElement = event.target;
  if (!(outedElement instanceof HTMLElement)) {
    return;
  }
  const isEmoteContainer = outedElement.dataset.isEmoteContainer;
  const isEmotesContainer = outedElement.dataset.isEmotesContainer;
  if (isEmoteContainer || isEmotesContainer) {
    selectedEmote.value = null;
  }
  emit("clearSelectedEmote");
}

type FFZSetRecord = Awaited<
  ReturnType<typeof fetchFFZUserRoomByTwitchId>
>["sets"];
type FFZSet = FFZSetRecord[keyof FFZSetRecord];

const props = defineProps<{
  sets: FFZSet[];
  maxEmoticons?: number;
}>();
</script>
