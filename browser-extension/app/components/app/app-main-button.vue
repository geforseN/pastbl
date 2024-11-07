<template>
  <button
    type="button"
    :style="$mainButtonStyles"
    class="btn btn-circle text-3xl"
  >
    bl
  </button>
</template>
<script setup lang="ts">
import { $mainButtonStyles } from "~/utils/settings.store";

defineOptions({
  tagColor: "#ea580c",
});
</script>
