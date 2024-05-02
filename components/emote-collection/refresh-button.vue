<template>
  <button
    class="btn btn-accent"
    :class="[size.btn, props.isParentRefreshing && props.refreshingClass]"
    :disabled="props.isParentRefreshing"
  >
    {{ props.isParentRefreshing ? $t("refreshing") : $t("refresh") }}
    <icon
      name="ic:round-refresh"
      :size="size.icon"
      :class="[
        size.iconClass,
        props.iconClass,
        props.isParentRefreshing && props.iconRefreshingClass,
      ]"
    />
  </button>
</template>
<script lang="ts" setup>
import { buttonComponentsStyles, type ButtonSize } from ".";

const props = withDefaults(
  defineProps<{
    size: ButtonSize;
    isParentRefreshing: boolean;
    iconClass?: string;
    iconRefreshingClass?: string;
    refreshingClass?: string;
  }>(),
  {
    iconClass: "",
    iconRefreshingClass: "animate-spin",
    refreshingClass:
      "animate-pulse disabled:border-2 disabled:border-base-content disabled:border-opacity-100 disabled:bg-accent disabled:text-opacity-100",
  },
);

const size = computed(() => buttonComponentsStyles[props.size]);
</script>
