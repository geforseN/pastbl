<template>
  <div class="flex flex-col gap-1 rounded-box border p-2">
    <h2 class="p-1 text-3xl font-bold">Edit pasta</h2>
    <div class="flex flex-col gap-2 xl:w-full xl:flex-row xl:justify-between">
      <pasta-form-textarea
        id="twitch-chat-textarea"
        ref="pastaFormTextareaRef"
        v-model="text"
        class="mx-0.5"
        @enter-pressed="emit('accept')"
      />
      <div
        class="flex flex-row-reverse items-center justify-between gap-1 xl:w-full xl:flex-col"
      >
        <div class="flex gap-4">
          <button class="btn btn-error" @click="() => emit('decline')">
            Decline
          </button>
          <button class="btn btn-success grow" @click="() => emit('accept')">
            Accept
          </button>
        </div>
        <button></button>
        <div class="flex h-full flex-col justify-between">
          <pasta-form-pasta-length :pasta-text="trimmedText" />
          <button v-if="tags.length" class="btn btn-error btn-sm">
            REMOVE ALL TAGS
          </button>
          <span v-else class="badge badge-warning badge-lg">No tags added</span>
        </div>
      </div>
    </div>
    <pasta-form-tags :tags="tags" />
    <pasta-form-tags-input v-model="tag" />
  </div>
</template>
<script setup lang="ts">
const text = defineModel("text", { required: true, type: String });
const tag = defineModel("tag", { required: true, type: String });
const tags = defineModel("tags", { required: true, type: Array<string> });

const trimmedText = computed(() => trimPastaText(text.value));

const pastaFormTextareaRef = ref();

const emit = defineEmits<{
  decline: [];
  accept: [];
}>();

defineExpose({
  pastaFormTextareaRef,
});
</script>
