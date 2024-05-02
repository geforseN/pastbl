<template>
  <button
    :class="[
      size.btn,
      props.isCollectionSelected ? 'btn-error' : 'btn-primary',
    ]"
    class="btn"
    @click="emit(props.isCollectionSelected ? 'unselect' : 'select')"
  >
    {{
      $t(
        props.isCollectionSelected
          ? "userCollection.makeInactive"
          : "collections.users.ready.button.select",
      )
    }}
  </button>
</template>
<script lang="ts" setup>
import { buttonComponentsStyles } from "~/components/emote-collection";

const props = defineProps<{
  isCollectionSelected: boolean;
  size: "xs" | "sm";
}>();

const emit = defineEmits<{
  select: [];
  unselect: [];
}>();

const size = computed(() => buttonComponentsStyles[props.size]);
</script>
