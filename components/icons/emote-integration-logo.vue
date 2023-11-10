<template>
  <icons-ffz-logo v-if="props.source === 'FrankerFaceZ'" />
  <icons-bttv-logo v-else-if="props.source === 'BetterTTV'" />
  <icons-seventv-logo v-else-if="props.source === 'SevenTV'" />
</template>

<script lang="ts" setup>
import type { AvailableEmoteSources } from "~/integrations";

const props = defineProps<{ source: AvailableEmoteSources }>();
</script>
