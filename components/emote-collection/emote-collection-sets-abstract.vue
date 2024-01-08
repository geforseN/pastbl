<template>
  <emote-collection-ffz-sets
    v-if="props.source === 'FrankerFaceZ'"
    :sets="props.sets"
    :capacity="props.capacity"
  />
  <emote-collection-bttv-sets
    v-else-if="props.source === 'BetterTTV'"
    :sets="props.sets"
  />
  <emote-collection-seventv-sets
    v-else-if="props.source === 'SevenTV'"
    :sets="props.sets"
  />
</template>
<script lang="ts" setup generic="S extends AvailableEmoteSource">
import type {
  AvailableEmoteSource,
  BetterTTVSet,
  FrankerFaceZSet,
  I7TVSet,
} from "~/integrations";

type SetProps = {};

type Props = {
  source: S;
} & SetProps;

const props = defineProps<Props>();
</script>
