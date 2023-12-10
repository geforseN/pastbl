<template>
  <div class="rounded-box bg-base-100 p-2">
    <emote-collection-bttv-sets
      v-if="props.collection.source === 'BetterTTV'"
      class="pt-1"
      :sets="(collection as BetterTTVGlobalCollection).sets"
    />
    <emote-collection-ffz-sets
      v-else-if="props.collection.source === 'FrankerFaceZ'"
      class="flex flex-col gap-1 pt-1"
      :sets="(collection as FrankerFaceZGlobalCollection).sets"
    />
    <emote-collection-seventv-sets
      v-else-if="props.collection.source === 'SevenTV'"
      class="pt-1"
      :sets="(collection as I7TVGlobalCollection).sets"
    />
    <use-time-ago :time="collection.updatedAt" #="{ timeAgo }">
      <div>Emotes was loaded {{ timeAgo }}</div>
    </use-time-ago>
    <button class="btn btn-primary" @click="emit('update')">Update</button>
  </div>
</template>
<script setup lang="ts">
import { UseTimeAgo } from "@vueuse/components";

import type { IGlobalEmoteCollection } from "~/integrations";
import type { BetterTTVGlobalCollection } from "~/integrations/BetterTTV/entity/BetterTTVGlobalCollection";
import type { FrankerFaceZGlobalCollection } from "~/integrations/FrankerFaceZ/entity/FrankerFaceZGlobalCollection";
import type { I7TVGlobalCollection } from "~/integrations/SevenTV";

const props = defineProps<{
  collection: IGlobalEmoteCollection;
}>();
const emit = defineEmits(["update"]);
</script>
