<template>
  <icon-ffz-logo v-if="props.source === 'FrankerFaceZ'" />
  <icon-bttv-logo v-else-if="props.source === 'BetterTTV'" />
  <icon-seventv-logo v-else-if="props.source === 'SevenTV'" />
</template>

<script lang="ts" setup>
import type { AvailableEmoteSource } from "~/integrations";

const props = defineProps<{ source: AvailableEmoteSource }>();
</script>
