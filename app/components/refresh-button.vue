<template>
  <button
    class="btn btn-accent"
    :class="[size.btn, props.isInProcess && props.inProcessClass]"
    :disabled="props.isInProcess"
  >
    {{ props.isInProcess ? $t("refreshing") : $t("refresh") }}
    <icon
      name="ic:round-refresh"
      :size="size.icon"
      :class="[
        size.iconClass,
        props.iconClass,
        props.isInProcess && props.inProcessIconClass,
      ]"
    />
  </button>
</template>
<script lang="ts" setup>
import { sizeStyles, type ButtonSize } from "~/components/button";

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
    inProcessIconClass: "animate-spin",
    inProcessClass:
      "animate-pulse disabled:border-2 disabled:border-base-content disabled:border-opacity-100 disabled:bg-accent disabled:text-opacity-100",
  },
);

const size = computed(() => sizeStyles[props.size]);
</script>
