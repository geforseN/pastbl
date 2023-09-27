<template>
  <div class="border border-black">
    <span class="border w-full flex py-[5px] px-[10px]">
      <slot />
      {{ ":" }}
      <span class="text leading-[19.5px] text-[13px] font-normal align-baseline">
        {{ pasta.text }}
      </span>
    </span>
    <div class="">
      <div v-for="tag of pasta.tags" class="badge secondary">{{ tag }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Pasta } from "~/stores/pastas.store";

const { pasta } = defineProps<{ pasta: Pasta }>();
</script>

<style scoped>
.text {
  overflow-wrap: anywhere;
  text-size-adjust: 100%;
  font-family: Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>