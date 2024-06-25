<template>
  <div
    :class="[...chatPastaList.tailwind.heights]"
    class="skeleton flex w-[342px] justify-center rounded-btn rounded-t-none p-2"
  >
    {{ $t("pastas.loading") }}
  </div>
</template>
<script setup lang="ts">
import { chatPastaList } from "~~/config/css";
</script>
