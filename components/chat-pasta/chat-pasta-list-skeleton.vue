<template>
  <div
    class="skeleton flex h-[50dvh] w-[340px] justify-center rounded-btn rounded-t-none p-2 go-brr:h-[66dvh]"
  >
    {{ $t(l + "loading") }}
  </div>
</template>
<script lang="ts" setup>
import { l } from "~/components/chat-pasta/chat-pasta-list.vue";
</script>
