<template>
  <ol class="flex w-full flex-col gap-1 xs:w-96 2xl:w-auto 2xl:flex-row">
    <li
      v-if="props.user.collections.FrankerFaceZ"
      class="flex flex-col divide-y-2 divide-ffz border-2 border-ffz bg-[#222222] p-2 text-white"
    >
      <emote-collection-header
        v-bind="{ isError: false, isLoading: false, isReady: false }"
      >
        <h3>FrankerFaceZ</h3>
        <template #collection-logo>
          <icons-ffz-logo class="max-h-[32px]" height="32" />
        </template>
      </emote-collection-header>

      <emote-collection-ffz-sets
        class="flex flex-col gap-1 pt-1"
        :sets="props.user.collections.FrankerFaceZ.sets"
        :capacity="100"
      />
    </li>
    <!-- props.user.collections.FrankerFaceZ.owner.maxEmotes -->
    <li
      v-if="props.user.collections.BetterTTV"
      class="flex flex-col divide-y-2 divide-[#63b3ed] border-2 border-[#63b3ed] bg-[#1a202c] p-2 text-white"
    >
      <emote-collection-header
        v-bind="{ isError: false, isLoading: false, isReady: false }"
      >
        <h3>BetterTTV</h3>
        <template #collection-logo>
          <icons-bttv-logo class="max-h-[32px]" height="32" />
        </template>
      </emote-collection-header>
      <emote-collection-bttv-sets
        class="pt-1"
        :sets="props.user.collections.BetterTTV.sets"
      />
    </li>
    <li
      v-if="props.user.collections.SevenTV"
      class="flex flex-col divide-y-2 divide-[#2599cd] border-2 border-[#2599cd] bg-[#181d1f] p-2 text-white"
    >
      <emote-collection-header
        v-bind="{ isError: false, isLoading: false, isReady: false }"
      >
        <h3>SevenTV</h3>
        <template #collection-logo>
          <icons-seventv-logo class="max-h-[32px]" height="32" />
        </template>
      </emote-collection-header>
      <emote-collection-seventv-sets
        class="pt-1"
        :sets="props.user.collections.SevenTV.sets"
      />
    </li>
  </ol>
</template>
<script lang="ts" setup>
import type { IUserEmoteCollection } from "~/integrations";
// import type { BetterTTVSet } from "~/integrations/BetterTTV/entity/BetterTTVSet";
// import type { FrankerFaceZSet } from "~/integrations/FrankerFaceZ/entity/FrankerFaceZSet";
// import type { I7TVSet } from "~/integrations/SevenTV";
// import type { FrankerFaceZUserCollection } from "~/integrations/FrankerFaceZ/entity/FrankerFaceZUserCollection";

const props = defineProps<{ user: IUserEmoteCollection }>();
</script>
