<template>
  <!-- TODO make id as prop, use useAttrs or $attrs -->
  <textarea
    id="twitch-chat"
    ref="textarea"
    v-model="input"
    placeholder="Enter a pasta"
    @keyup.enter.exact="(event) => emit('enterPressed', event)"
    class="min-w-[320px] max-w-[320px] min-h-[7rem] max-h-[50vh] resize-none px-4 py-2 text box-content leading-[19.5px] text-[13px] font-normal placeholder:text-lg placeholder:relative placeholder:bottom-1 placeholder:text-base-content caret-[#a970ff] rounded outline outline-2 outline-base-content hover:outline hover:outline-4 hover:outline-base-content focus-within:outline focus-within:outline-4 focus-within:outline-[#a970ff] hover:focus-within:outline hover:focus-within:outline-[5px] hover:focus-within:outline-[#a970ff]"
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
