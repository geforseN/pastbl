<template>
  <button class="btn btn-error flex-nowrap" :class="[size.btn]">
    {{ $t("delete") }}
    <icon
      name="ic:round-delete-outline"
      :size="size.icon"
      :class="[size.iconClass, props.iconClass]"
    />
  </button>
</template>
<script lang="ts" setup>
import {
  buttonComponentsStyles,
  type ButtonSize,
} from "~/components/emote-collection";

const props = defineProps<{
  size: ButtonSize;
  iconClass?: string;
}>();

const size = computed(() => buttonComponentsStyles[props.size]);
</script>
