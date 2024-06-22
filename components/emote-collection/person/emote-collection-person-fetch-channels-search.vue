<template>
  <div
    v-auto-animate
    class="max-h-60 overflow-y-auto rounded"
    :class="mustShow && channels.length > 0 && 'border border-accent'"
  >
    <template v-if="mustShow">
      <emote-collection-person-fetch-channels-search-item
        v-for="channel of channels"
        :key="channel.id"
        v-bind="channel"
        @load="$emit('load', channel.nickname)"
      />
    </template>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  mustShow: boolean;
  channels: Channel[];
}>();
defineEmits<{
  load: [nickname: string];
}>();
</script>
