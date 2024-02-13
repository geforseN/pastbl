<template>
  <span class="px-1.5">
    {{ $t("pasta.formCommon.length") }}:
    <span v-bind="$attrs" :class="classes[status]">
      {{ pastaText.length }}
    </span>
  </span>
</template>
<script setup lang="ts">
defineOptions({ inheritAttrs: false });

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
};
</script>
