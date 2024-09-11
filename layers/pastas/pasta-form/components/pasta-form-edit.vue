<template>
  <div class="space-y-1 rounded-box border p-2">
    <h2 class="p-1 text-3xl font-bold">{{ $t("pasta.edit") }}</h2>
    <div class="flex flex-col gap-2 xl:w-full xl:flex-row xl:justify-between">
      <pasta-form-textarea
        id="twitch-chat-textarea"
        ref="pastaFormTextarea"
        v-model="text"
        class="mx-0.5"
        @submit="$emit('accept')"
      />
      <div
        class="flex flex-row-reverse items-center justify-between gap-1 xl:w-full xl:flex-col"
      >
        <span
          v-if="isPastaSame"
          class="badge badge-error badge-lg hidden h-fit w-fit font-bold xl:block"
        >
          {{ $t("pasta.makeChangesIn") }}
        </span>
        <div class="flex gap-4">
          <button class="btn btn-error" @click="$emit('decline')">
            {{ $t("decline") }}
          </button>
          <button
            :disabled="isPastaSame"
            class="btn btn-success grow"
            @click="$emit('accept')"
          >
            {{ $t("accept") }}
          </button>
        </div>
        <div
          class="flex h-full w-fit flex-col items-center justify-between gap-0.5"
        >
          <pasta-form-pasta-length :pasta-text="trimmedText" />
          <button
            v-if="tags.length > 0"
            class="btn btn-error btn-sm"
            @click="$emit('removeAllTags')"
          >
            {{ $t("tags.remove") }}
          </button>
          <span v-else class="badge badge-warning badge-lg">
            {{ $t("tags.noAdded") }}
          </span>
        </div>
      </div>
    </div>
    <span
      v-if="isPastaSame"
      class="badge badge-error badge-lg h-fit w-fit font-bold"
    >
      {{ $t("pasta.makeChangesIn") }}
    </span>
    <pasta-form-tags
      class="xs:max-w-[420px]"
      :tags="tags"
      @remove-tag="(tag) => $emit('removeTag', tag)"
    />
    <pasta-form-tags-input
      v-model="tag"
      @add-tag="(tag) => $emit('addTag', tag)"
    />
  </div>
</template>
<script setup lang="ts">
import type { PastaFormTextarea } from "#build/components";

const text = defineModel<string>("text", { required: true });
const tag = defineModel<string>("tag", { required: true });
const tags = defineModel<string[]>("tags", { required: true });

defineProps<{
  trimmedText: string;
  isPastaSame: boolean;
}>();

const pastaFormTextareaRef =
  useTemplateRef<InstanceType<typeof PastaFormTextarea>>("pastaFormTextarea");

defineEmits<{
  decline: [];
  accept: [];
  addTag: [string];
  removeTag: [string];
  removeAllTags: [];
}>();

defineExpose({
  pastaFormTextareaRef,
});
</script>
