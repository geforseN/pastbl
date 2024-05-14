<template>
  <div class="flex justify-center bg-warning font-bold text-warning-content">
    {{ $t(l + "empty") }}
  </div>
</template>
<script setup lang="ts">
import { l } from "~/components/chat-pasta/chat-pasta-list.vue";
</script>
