<template>
  <!-- NOTE: focus:outline* classes are needed because in some scenarios the button has no default focus styles from 'btn' (focus-within is used in .css) -->
  <button
    class="btn btn-error flex-nowrap border-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-error"
    :class="size.btn"
  >
    {{ $t("delete") }}
    <icon
      name="ic:round-delete-outline"
      :size="size.icon"
      :class="[size.iconClass, props.iconClass]"
    />
  </button>
</template>
<script setup lang="ts">
import {
  sizeStyles,
  type ButtonSize,
} from "$/emote-integrations/components/button";

const props = defineProps<{
  size: ButtonSize;
  iconClass?: string;
}>();

const size = computed(() => sizeStyles[props.size]);
</script>
