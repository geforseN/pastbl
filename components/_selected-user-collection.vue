<template>
  <!-- NOTE: v-if below is like that, because we don't want to give flickers  -->
  <!-- NOTE: for current time, collection.error will be true if selectedCollectionUsername is empty string  -->
  <div
    v-if="collection.state && !collection.error"
    class="flex flex-col gap-2 rounded-btn border-2 border-twitch p-2"
  >
    <div class="flex gap-2 rounded-box p-2">
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
      <div class="flex w-full flex-col justify-between">
        <ul
          class="flex list-inside list-disc gap-2 marker:!mr-0 marker:text-twitch"
        >
          <li class="list-none">
            <nuxt-link
              class="link w-max rounded-lg decoration-twitch underline-offset-4 focus:no-underline focus:outline focus:outline-offset-4 focus:outline-twitch"
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
        <div class="flex justify-between gap-2">
          <div class="flex items-center gap-1">
            <use-time-ago :time="collection.state.updatedAt" #="{ timeAgo }">
              <time
                :datetime="new Date(collection.state.updatedAt).toISOString()"
              >
                loaded {{ timeAgo }}
              </time>
              <div
                ref="timeTooltipRef"
                class="tooltip tooltip-bottom tooltip-info"
                tabindex="0"
                :class="isTimeTooltipFocused && 'tooltip-open'"
                :data-tip="
                  new Date(collection.state.updatedAt).toLocaleString()
                "
              >
                <icon class="h-4 w-4" name="carbon:data-enrichment" />
              </div>
            </use-time-ago>
          </div>
          <button class="btn btn-accent btn-sm" @click="emit('update')">
            <span v-if="!isRefreshing">Update</span>
            <template v-else>
              <span class="loading loading-spinner" />Loading
            </template>
          </button>
        </div>
        {{}}
      </div>
    </div>
    <emote-collection-ffz-sync
      v-if="collection.state.collections.FrankerFaceZ"
      class="rounded-btn"
      :sets="collection.state.collections.FrankerFaceZ.sets"
      :capacity="collection.state.collections.FrankerFaceZ.owner.maxEmotes"
    />
    <emote-collection-seventv-sync
      v-if="collection.state.collections.SevenTV"
      class="rounded-btn"
      :sets="collection.state.collections.SevenTV.sets"
    />
    <emote-collection-bttv-sync
      v-if="collection.state.collections.BetterTTV"
      class="rounded-btn"
      :sets="collection.state.collections.BetterTTV.sets"
    />
  </div>
</template>
<script setup lang="ts">
import { UseTimeAgo } from "@vueuse/components";

const { collection, isCollectionSelected } = defineProps<{
  collection: SelectedUserCollectionsAsyncState;
  isCollectionSelected?: boolean;
  isRefreshing: boolean;
}>();

const emit = defineEmits<{
  update: [];
}>();

const timeTooltipRef = ref<HTMLDivElement>();
const { focused: isTimeTooltipFocused } = useFocus(timeTooltipRef);
</script>
