<template>
  <span class="flex w-8 flex-col gap-1">
    <emote-integration-logo
      v-for="(source, index) of allEmoteSources"
      v-once
      :key="source"
      :class="[
        index % 2 && `absolute translate-x-5`,
        index === 3 && 'translate-y-[21px]',
      ]"
      :source="source"
      width="16"
      height="16"
      class="max-h-[16px] text-xs"
    />
  </span>
</template>
