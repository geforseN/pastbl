<template>
  <div
    :class="[
      appConfig.pastaList.heights.base,
      appConfig.pastaList.heights.goBrr,
    ]"
    class="skeleton flex w-[342px] justify-center rounded-btn rounded-t-none p-2"
  >
    {{ $t("pastas.loading") }}
  </div>
</template>
<script setup lang="ts">
const appConfig = useAppConfig();
</script>
