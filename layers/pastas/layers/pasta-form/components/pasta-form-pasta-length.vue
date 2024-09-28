<template>
  <span class="px-1.5">
    {{ $t("pasta.length") }}:
    <output
      name="pasta-length"
      v-bind="$attrs"
      :class="classes[status]"
    >
      {{ props.pastaText.length }}
    </output>
  </span>
</template>
<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  pastaTextStatus?: "success" | "warning" | "error";
  pastaText: string;
}>();

const status = computed(
  () => props.pastaTextStatus ?? getTextStatus(props.pastaText),
);

const classes = {
  error: "text-error",
  warning: "text-warning",
  success: "text-success",
} as const;
</script>
