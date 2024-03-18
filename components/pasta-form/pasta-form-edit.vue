<template>
  <div class="flex flex-col gap-1 rounded-box border p-2">
    <h2 class="p-1 text-3xl font-bold">{{ $t("pasta.edit") }}</h2>
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
        <span
          v-if="props.isPastaSame"
          class="badge badge-error badge-lg font-bold"
        >
          {{ $t("pasta.makeChangesIn") }}
        </span>
        <div class="flex gap-4">
          <button class="btn btn-error" @click="emit('decline')">
            {{ $t("decline") }}
          </button>
          <button
            :disabled="props.isPastaSame"
            class="btn btn-success grow"
            @click="emit('accept')"
          >
            {{ $t("accept") }}
          </button>
        </div>
        <div
          class="flex h-full w-fit flex-col items-center justify-between gap-0.5"
        >
          <pasta-form-pasta-length :pasta-text="props.trimmedText" />
          <button
            v-if="tags.length"
            class="btn btn-error btn-sm"
            @click="emit('removeAllTags')"
          >
            {{ $t("tags.remove") }}
          </button>
          <span v-else class="badge badge-warning badge-lg">
            {{ $t("tags.noAdded") }}
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
import type { PastaFormTextarea } from "#build/components";

const text = defineModel("text", { required: true, type: String });
const tag = defineModel("tag", { required: true, type: String });
const tags = defineModel("tags", { required: true, type: Array<string> });

const props = defineProps<{
  trimmedText: string;
  isPastaSame: boolean;
}>();

const pastaFormTextareaRef = ref<InstanceType<typeof PastaFormTextarea>>();

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
