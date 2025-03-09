<template>
  <textarea
    ref="textarea"
    v-model="input"
    data-testid="pasta-form-textarea"
    class="twitch-text caret-twitch-accent outline-base-content placeholder:text-base-content focus-within:outline-twitch-accent hover:outline-base-content hover:focus-within:outline-twitch-accent box-content max-h-[50vh] min-h-28 min-w-[320px] resize-none rounded px-4 py-2 text-[13px] font-normal leading-[19.5px] outline outline-2 placeholder:relative placeholder:bottom-1 placeholder:text-lg focus-within:outline focus-within:outline-4 hover:outline hover:outline-4 hover:focus-within:outline hover:focus-within:outline-[5px]"
    :class="[
      modelStatus === 'error' && 'bg-error/5',
      modelStatus === 'warning' && 'bg-warning/5',
      modelStatus === 'success' && 'bg-success/5',
    ]"
    :placeholder="$t('pasta.formCommon.textareaPlaceholder')"
    enterkeyhint="done"
    @keyup.enter.exact.prevent="
      () => {
        if (!previousValue) {
          return;
        }
        modelValue = previousValue;
        $emit('submit');
      }
    "
  />
</template>
<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });
const previousValue = usePrevious(modelValue);

defineProps<{
  modelStatus?: "error" | "warning" | "success";
}>();

defineEmits<{
  submit: [];
}>();

const { textarea, input } = useTextareaAutosize({
  input: modelValue,
});

defineExpose({
  textareaRef: textarea,
});
</script>
