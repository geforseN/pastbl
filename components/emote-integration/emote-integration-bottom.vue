<template>
  <div
    :class="styles.borderAccent"
    class="flex justify-between rounded-box border-2 p-1 px-2"
  >
    <emote-collection-formed-at :time="props.COLLECTIONupdatedAt" />
    <emote-collection-refresh-button
      size="xs"
      class="w-fit gap-0.5"
      :is-refreshing="props.isCOLLECTIONRefreshing"
      @click="emit('refresh')"
    />
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
