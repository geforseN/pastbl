<template>
  <button
    class="btn btn-secondary"
    :class="[styles.btn, isInProcess && inProcessClass]"
    :disabled="isInProcess"
  >
    {{ isInProcess ? $t("loading") : $t("load") }}
    <icon
      name="ic:round-download"
      :size="styles.icon"
      :class="[styles.iconClass, iconClass, isInProcess && inProcessIconClass]"
    />
  </button>
</template>
<script setup lang="ts">
import { computed } from "vue";
import {
  sizeStyles,
  type ButtonSize,
} from "$/emote-integrations/components/button";

const props = withDefaults(
  defineProps<{
    size: ButtonSize;
    isInProcess: boolean;
    iconClass?: string;
    inProcessIconClass?: string;
    inProcessClass?: string;
  }>(),
  {
    iconClass: "",
    inProcessIconClass: "animate-pulse",
    inProcessClass:
      "animate-pulse disabled:border-2 disabled:border-base-content disabled:border-opacity-100 disabled:bg-secondary disabled:text-opacity-100",
  },
);

const styles = computed(() => sizeStyles[props.size]);
</script>
