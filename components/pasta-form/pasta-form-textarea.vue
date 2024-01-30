<template>
  <textarea
    ref="textarea"
    v-model="input"
    class="twitch-text box-content max-h-[50vh] min-h-[7rem] min-w-[320px] resize-none rounded px-4 py-2 text-[13px] font-normal leading-[19.5px] caret-twitch outline outline-2 outline-base-content placeholder:relative placeholder:bottom-1 placeholder:text-lg placeholder:text-base-content focus-within:outline focus-within:outline-4 focus-within:outline-twitch hover:outline hover:outline-4 hover:outline-base-content hover:focus-within:outline hover:focus-within:outline-[5px] hover:focus-within:outline-twitch"
    :class="[
      props.modelStatus === 'error' && 'bg-error/5',
      props.modelStatus === 'warning' && 'bg-warning/5',
      props.modelStatus === 'success' && 'bg-success/5',
    ]"
    placeholder="Enter a pasta"
    @keyup.enter.exact.prevent="
      () => {
        if (!previousValue) {
          return;
        }
        modelValue = previousValue;
        emit('enterPressed');
      }
    "
  />
</template>
<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });
const previousValue = usePrevious(modelValue);

const props = defineProps<{
  modelStatus?: "error" | "warning" | "success";
}>();
const emit = defineEmits<{
  enterPressed: [];
}>();

const { textarea, input } = useTextareaAutosize({
  input: modelValue,
});

defineExpose({
  textareaRef: textarea,
});
</script>
