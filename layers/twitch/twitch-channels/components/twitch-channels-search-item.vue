<template>
  <div class="bg-base-200 flex items-center gap-2 p-1">
    <twitch-user-avatar
      :twitch="{ avatarUrl: thumbnailUrl, login, nickname }"
      :size="24"
    />
    <span
      class="line-clamp-1 break-all"
      :title="nickname"
    >
      {{ nickname }}
    </span>
    <div class="ml-auto flex items-center gap-1">
      <span
        v-if="isExact"
        class="badge bg-success text-nowrap rounded-md border-0 font-bold uppercase"
      >
        {{ $t("exact") }}
      </span>
      <span
        v-if="isLive"
        class="badge text-nowrap rounded-md border-0 bg-red-600 font-bold uppercase"
      >
        {{ $t("live") }}
      </span>
      <button
        class="btn btn-accent btn-xs"
        @click="$emit('load')"
      >
        {{ $t("load") }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ITwitchChannel } from "../utils/types.ts";

defineProps<ITwitchChannel>();

defineEmits<{
  load: [];
}>();
</script>
