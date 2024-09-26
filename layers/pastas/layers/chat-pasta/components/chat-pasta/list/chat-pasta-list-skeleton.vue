<template>
  <div
    :class="appConfig.pastaList.heights"
    class="skeleton flex w-[342px] justify-center rounded-btn rounded-t-none p-2"
  >
    {{ $t("pastas.loading") }}
  </div>
</template>
<script setup>
const appConfig = useAppConfig();
</script>
