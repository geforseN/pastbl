<template>
  <div class="flex items-center gap-1">
    <span class="mr-4 flex flex-col gap-1">
      <emote-integration-logo
        v-for="(source, index) of emoteSources"
        v-once
        :key="source"
        :class="[
          index % 2 && `absolute translate-x-5`,
          index === 3 && ' translate-y-[21px]',
        ]"
        :source="source"
        width="16"
        height="16"
        class="max-h-[16px] text-xs"
      />
    </span>
  </div>
</template>
<script setup lang="ts">
import { emoteSources } from "~/integrations";
</script>
