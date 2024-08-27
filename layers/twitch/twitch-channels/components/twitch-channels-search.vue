<template>
  <div
    data-testid="twitch-channels-search"
    ref="containerRef"
    v-auto-animate
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
<script lang="ts" setup>
const containerRef = ref<HTMLDivElement>();

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
