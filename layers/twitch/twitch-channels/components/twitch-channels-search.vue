<template>
  <div
    ref="container"
    v-auto-animate
    data-testid="twitch-channels-search"
    class="max-h-60 divide-y divide-accent/50 overflow-y-auto rounded"
    :class="mustShow && channels.length > 0 && 'border border-accent'"
  >
    <template v-if="mustShow">
      <twitch-channels-search-item
        v-for="channel of channels"
        :key="channel.id"
        v-bind="channel"
        @load="$emit('load', channel.nickname)"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import type { ITwitchChannel } from "../utils/types";

const containerRef = useTemplateRef("container");

defineProps<{
  mustShow: boolean;
  channels: ITwitchChannel[];
}>();

defineEmits<{
  load: [nickname: string];
}>();

defineExpose({
  containerRef,
});
</script>
