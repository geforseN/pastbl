<template>
  <textarea
    ref="textarea"
    v-model="input"
    placeholder="Enter a pasta"
    @keyup.enter.exact="(event) => emit('enterPressed', event)"
    class="min-w-[320px] max-w-[320px] min-h-[7rem] max-h-[50vh] resize-none text box-content leading-[19.5px] text-[13px] font-normal placeholder:text-lg placeholder:text-base-content caret-[#a970ff] rounded focus-within:outline-[#a970ff] focus-within:outline-offset-0 focus-within:outline-4 border-base-content border-2 px-[16px] py-[8px] hover:px-[15px] hover:py-[7px] hover:border-[3px]"
  />
</template>
<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });
const emit = defineEmits<{
  enterPressed: [event: KeyboardEvent];
}>();

const { textarea, input } = useTextareaAutosize({
  input: modelValue,
});

defineExpose({
  textareaRef: textarea,
});
</script>
<style scoped>
.text {
  overflow-wrap: anywhere;
  text-size-adjust: 100%;
  font-family: Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>
