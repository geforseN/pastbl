<template>
  <div class="flex flex-col gap-1 rounded-box border p-2">
    <h2 class="p-1 text-3xl font-bold">{{ $t("pasta.edit.heading") }}</h2>
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
            {{ $t("pasta.edit.decline") }}
          </button>
          <button class="btn btn-success grow" @click="() => emit('accept')">
            {{ $t("pasta.edit.accept") }}
          </button>
        </div>
        <button></button>
        <div class="flex h-full w-fit flex-col justify-between">
          <pasta-form-pasta-length :pasta-text="trimmedText" />
          <button
            v-if="tags.length"
            class="btn btn-error btn-sm"
            @click="() => emit('removeAllTags')"
          >
            {{ $t("pasta.formCommon.tags.removeButton") }}
          </button>
          <span v-else class="badge badge-warning badge-lg">
            {{ $t("pasta.formCommon.tags.onEmptyBadge") }}
          </span>
        </div>
      </div>
    </div>
    <pasta-form-tags
      class="xs:max-w-[420px]"
      :tags="tags"
      @remove-tag="(tag) => emit('removeTag', tag)"
    />
    <pasta-form-tags-input
      v-model="tag"
      @add-tag="(tag) => emit('addTag', tag)"
    />
  </div>
</template>
<script setup lang="ts">
const text = defineModel("text", { required: true, type: String });
const tag = defineModel("tag", { required: true, type: String });
const tags = defineModel("tags", { required: true, type: Array<string> });

const trimmedText = computed(() => megaTrim(text.value));

const pastaFormTextareaRef = ref();

const emit = defineEmits<{
  decline: [];
  accept: [];
  addTag: [tag: string];
  removeTag: [tag: string];
  removeAllTags: [];
}>();

defineExpose({
  pastaFormTextareaRef,
});
</script>
