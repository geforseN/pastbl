<template>
  <ol class="flex w-full flex-col gap-1 xs:w-96 2xl:w-auto 2xl:flex-row">
    <emote-collection-ffz-sync
      v-if="props.user.collections.FrankerFaceZ"
      :sets="props.user.collections.FrankerFaceZ.sets"
      :capacity="props.user.collections.FrankerFaceZ.owner.maxEmotes"
    />
    <emote-collection-bttv-sync
      v-if="props.user.collections.BetterTTV"
      :sets="props.user.collections.BetterTTV.sets"
    />
    <emote-collection-seventv-global
      v-if="props.user.collections.SevenTV"
      :sets="props.user.collections.SevenTV.sets"
    />
  </ol>
</template>
<script lang="ts" setup>
import type { IUserEmoteCollection } from "~/integrations";

const props = defineProps<{ user: IUserEmoteCollection }>();
</script>
