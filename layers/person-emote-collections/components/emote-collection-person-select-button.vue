<template>
  <button
    :class="[
      size.btn,
      props.isCollectionSelected ? 'btn-error' : 'btn-primary',
    ]"
    class="btn"
  >
    {{
      $t(
        props.isCollectionSelected
          ? "collection._makeInactive"
          : "collections.users.ready.button.select",
      )
    }}
    <icon
      v-if="props.isCollectionSelected"
      name="material-symbols:person-off-outline"
    />
    <icon v-else name="material-symbols:person-check-outline" />
  </button>
</template>
<script lang="ts" setup>
import { sizeStyles, type ButtonSize } from "~/components/button";

const props = defineProps<{
  isCollectionSelected: boolean;
  size: ButtonSize;
}>();

const size = computed(() => sizeStyles[props.size]);
</script>
