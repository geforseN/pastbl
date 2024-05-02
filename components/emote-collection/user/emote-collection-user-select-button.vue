<template>
  <button
    :class="[size.btn, props.isSelected ? 'btn-error' : 'btn-primary']"
    class="btn"
    @click="emit(props.isSelected ? 'unselect' : 'select')"
  >
    {{
      $t(
        props.isSelected
          ? "userCollection.makeInactive"
          : "collections.users.ready.button.select",
      )
    }}
  </button>
</template>
<script lang="ts" setup>
import { buttonComponentsStyles } from "~/components/emote-collection";

const props = defineProps<{
  isSelected: boolean;
  size: "xs" | "sm";
}>();

const emit = defineEmits<{
  select: [];
  unselect: [];
}>();

const size = computed(() => buttonComponentsStyles[props.size]);
</script>
