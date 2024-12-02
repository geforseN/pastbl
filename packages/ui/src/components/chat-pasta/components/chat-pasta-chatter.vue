<!-- eslint-disable tailwindcss/enforces-negative-arbitrary-values -->
<template>
  <div
    class="overflow-wrap-anywhere -m-[.2rem] inline-block break-all p-[0.2rem] align-baseline"
  >
    <div
      v-for="badge of badges"
      :key="typeof badge === 'number' ? badge : JSON.stringify(badge)"
      class="mr-[1.5px] inline-flex size-twitch-badge items-center justify-center bg-red-600 align-middle text-base"
    >
      {{ badge }}
    </div>
    <span
      class="twitch-text text-[13px]/[18px] font-bold"
      :style="{ color: nicknameColor }"
    >
      {{ nickname }}
    </span>
  </div>
</template>
<script setup lang="ts">
import type { ChatPastaChatterProps } from "./chat-pasta-chatter";

defineProps<ChatPastaChatterProps>();
</script>
