<template>
  <div
    v-if="collection.isReady && collection.state"
    class="flex w-96 flex-col gap-2"
  >
    <div class="flex gap-2">
      <nuxt-link
        :to="`https://twitch.tv/${collection.state.twitch.username}`"
        class="rounded-full border border-twitch focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch"
      >
        <img
          class="rounded-full bg-twitch/20"
          width="64"
          height="64"
          :src="collection.state.collections.FrankerFaceZ.owner.avatarUrl"
          :alt="collection.state.twitch.nickname + ' avatar'"
        />
      </nuxt-link>
      <div class="flex flex-col justify-between">
        <ul
          class="flex list-inside list-disc gap-2 marker:!mr-0 marker:text-twitch"
        >
          <li class="list-none">
            <nuxt-link
              class="link w-max rounded-lg decoration-twitch underline-offset-4 focus:outline-offset-4 focus:outline-twitch"
              :to="`https://twitch.tv/${collection.state.twitch.username}`"
            >
              <!-- TODO: fix styles when nickname is too long (use String.prototype.repeat for debug) -->
              {{ collection.state.twitch.nickname }}
            </nuxt-link>
          </li>
          <li v-if="isCollectionSelected">
            <span class="-ml-2 text-xs opacity-75">selected</span>
          </li>
        </ul>
        <div class="flex gap-2">
          <use-time-ago :time="collection.state.updatedAt" #="{ timeAgo }">
            <time datetime="">loaded {{ timeAgo }}</time>
          </use-time-ago>
          <!-- TODO add @click emit -->
          <button class="btn btn-primary btn-xs h-min px-1 py-0 text-xs/3">
            Update
          </button>
        </div>
      </div>
    </div>
    <emote-collection-ffz-sync
      v-if="collection.state.collections.FrankerFaceZ"
      :sets="collection.state.collections.FrankerFaceZ.sets"
      :capacity="collection.state.collections.FrankerFaceZ.owner.maxEmotes"
    />
    <emote-collection-seventv-sync
      v-if="collection.state.collections.SevenTV"
      :sets="collection.state.collections.SevenTV.sets"
    />
    <emote-collection-bttv-sync
      v-if="collection.state.collections.BetterTTV"
      :sets="collection.state.collections.BetterTTV.sets"
    />
  </div>
</template>
<script setup lang="ts">
import { UseTimeAgo } from "@vueuse/components";

const { collection, isCollectionSelected } = defineProps<{
  collection: SelectedUserCollectionsAsyncState;
  isCollectionSelected?: boolean;
}>();
</script>
