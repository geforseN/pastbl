<template>
  <div class="flex w-96 flex-col gap-2 rounded-box border-2 border-twitch p-2">
    <div class="flex gap-2">
      <div class="flex h-16 min-w-16 items-center">
        <nuxt-link
          :to="`https://twitch.tv/${username}`"
          class="rounded-full border border-twitch focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch"
        >
          <img
            v-if="integrations.FrankerFaceZ"
            class="rounded-full bg-twitch/20"
            width="64"
            height="64"
            :src="integrations.FrankerFaceZ.owner.avatarUrl"
            :alt="nickname + ' avatar'"
          />
        </nuxt-link>
      </div>
      <div class="flex w-72 flex-col justify-between">
        <nuxt-link
          class="w-full truncate rounded-lg focus:no-underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch"
          :to="`https://twitch.tv/${username}`"
          :title="nickname"
        >
          <span
            class="link inline-block text-2xl font-bold decoration-twitch underline-offset-4"
          >
            {{ nickname.repeat(1) }}
          </span>
        </nuxt-link>
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1">
            <use-time-ago :time="updatedAt" #="{ timeAgo }">
              <time :datetime="new Date(updatedAt).toISOString()">
                loaded {{ timeAgo }}
              </time>
              <div
                ref="timeTooltipRef"
                class="tooltip tooltip-top tooltip-info box-content flex h-6 w-6 items-center justify-center rounded-full border bg-info focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-info"
                tabindex="0"
                :class="toValue(timeTooltip.focused) && 'tooltip-open'"
                :data-tip="new Date(updatedAt).toLocaleString()"
              >
                <icon size="16" name="carbon:data-enrichment" />
              </div>
            </use-time-ago>
          </div>
          <button
            class="btn btn-success btn-xs border border-success-content"
            @click="emit('refresh')"
          >
            refresh
            <icon name="ic:round-refresh" class="-ml-2" />
          </button>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between gap-1">
      <button
        class="btn btn-error btn-xs border border-error-content"
        @click="emit('delete')"
      >
        delete
        <icon name="ic:round-delete-outline" class="-ml-2" />
      </button>
      <button
        v-if="!props.collection.isSelected"
        class="btn btn-primary btn-xs"
        @click="emit('select')"
      >
        select as active
      </button>
      <div
        v-else
        ref="collectionActiveTooltipRef"
        class="badge badge-primary badge-lg tooltip tooltip-top tooltip-primary focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
        tabindex="0"
        :class="toValue(collectionActiveTooltip.focused) && 'tooltip-open'"
        :data-tip="`Emotes of ${nickname} used in your pastas`"
      >
        Selected as active
        <icon size="16" name="carbon:data-enrichment" class="mb-1" />
      </div>
    </div>
    <div>
      <emote-collection-ffz-sync
        class="rounded-btn"
        :sets="integrations.FrankerFaceZ?.sets"
        :error="failedIntegrationsReasons.FrankerFaceZ"
        :capacity="integrations.FrankerFaceZ?.owner.maxEmotes"
      />
      <emote-collection-bttv-sync
        class="rounded-btn"
        :sets="integrations.BetterTTV?.sets"
        :error="failedIntegrationsReasons.BetterTTV"
      />
      <emote-collection-seventv-sync
        class="rounded-btn"
        :error="failedIntegrationsReasons.SevenTV"
        :sets="integrations.SevenTV?.sets"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { UseTimeAgo } from "@vueuse/components";
import type { IUserEmoteCollection } from "~/integrations";

const timeTooltipRef = ref<HTMLDivElement>();
const timeTooltip = useFocus(timeTooltipRef);

const collectionActiveTooltipRef = ref<HTMLDivElement>();
const collectionActiveTooltip = useFocus(collectionActiveTooltipRef);

const props = defineProps<{
  collection: IUserEmoteCollection & {
    isSelected: boolean;
  };
}>();
const emit = defineEmits<{
  refresh: [];
  delete: [];
  select: [];
}>();

const { username, nickname } = props.collection.twitch;
const { integrations, updatedAt, failedIntegrationsReasons } = props.collection;
</script>
