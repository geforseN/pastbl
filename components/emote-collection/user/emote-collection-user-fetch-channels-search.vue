<template>
  <div
    ref="channelsContainerRef"
    v-auto-animate
    class="flex max-h-60 flex-col overflow-y-auto rounded"
    :class="props.mustShow && props.channels.length && 'border border-accent'"
  >
    <template v-if="props.mustShow">
      <div
        v-for="channel of props.channels"
        :key="channel.id"
        class="flex items-center gap-2 bg-base-content/30 p-1"
      >
        <img
          :src="channel.thumbnailUrl"
          width="24"
          height="24"
          loading="lazy"
          :alt="$t('avatar.alt', { nickname: channel.nickname })"
        />
        <span class="line-clamp-1 break-all" :title="channel.nickname">
          {{ channel.nickname }}
        </span>
        <div class="ml-auto flex items-center gap-1">
          <span
            v-if="channel.isExact"
            class="badge text-nowrap rounded-md border-0 bg-success font-bold uppercase"
          >
            {{ $t(cs + "exact") }}
          </span>
          <span
            v-if="channel.isLive"
            class="badge text-nowrap rounded-md border-0 bg-red-600 font-bold uppercase"
          >
            {{ $t(cs + "live") }}
          </span>
          <button
            class="btn btn-accent btn-xs"
            @click="emit('load', channel.nickname)"
          >
            {{ $t(cs + "load") }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { ExtraChannel } from "~/server/api/twitch/search/channels.get";

const cs = "collections.users.fetch.channels-search." as const;

const props = defineProps<{
  mustShow: boolean;
  channels: ExtraChannel[];
}>();
const emit = defineEmits<{
  load: [nickname: string];
}>();
</script>
