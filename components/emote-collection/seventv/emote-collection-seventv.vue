<template>
  <li
    class="flex flex-col divide-y-2 divide-[#2599cd] border-2 border-[#2599cd] bg-[#181d1f] p-2 text-white"
  >
    <emote-collection-header
      :is-loading="props.sevenTv.fullCollection.isLoading.value"
      :is-ready="props.sevenTv.fullCollection.isReady.value"
      :is-error="!!props.sevenTv.fullCollection.error.value"
    >
      <h3>SevenTV</h3>
      <template #collection-logo>
        <icons-seventv-logo class="max-h-[32px]" height="32" />
      </template>
    </emote-collection-header>
    <emote-collection-seventv-sets
      v-if="
        props.sevenTv.activeSet.isReady.value &&
        props.sevenTv.activeSet.state.value
      "
      class="pt-1"
      :sets="[props.sevenTv.activeSet.state.value]"
    />
    <div v-if="(props.sevenTv.fullCollection.error.value as Error)?.message">
      {{ (props.sevenTv.fullCollection.error.value as Error).message }}
    </div>
  </li>
</template>
<script lang="ts" setup>
const props = defineProps<{
  sevenTv: Use7TVReturn;
}>();
</script>
