<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2 xl:w-full xl:flex-row xl:justify-between">
      <pasta-form-textarea
        id="twitch-chat-textarea"
        ref="pastaFormTextareaRef"
        v-model="pastaTextModel"
        :model-status="pastaStatus"
        class="mx-0.5"
        @enter-pressed="emit('createPasta')"
      />
      <div
        class="flex flex-row-reverse items-center justify-between gap-1 xl:w-full xl:flex-col"
      >
        <button
          ref="createPastaButton"
          class="btn btn-primary h-max text-lg focus:outline-double focus:outline-4 focus:outline-offset-1 xl:w-full"
          @click="emit('createPasta')"
        >
          {{ $t("pasta.create.button") }}
        </button>
        <div class="flex h-full flex-col justify-between">
          <pasta-form-pasta-length
            :class="pastaLengthClassRecord[pastaStatus]"
            :pasta-text="trimmedText"
          />
          <button
            v-if="props.pastaTags.length"
            class="btn btn-error btn-sm"
            @click="emit('removeAllTags')"
          >
            {{ $t("pasta.create.tags.remove-button") }}
          </button>
          <span v-else class="badge badge-warning badge-lg">
            {{ $t("pasta.create.tags.on-empty-badge") }}
          </span>
        </div>
      </div>
    </div>
    <pasta-form-tags
      :tags="props.pastaTags"
      @remove-tag="(tag) => emit('removeTag', tag)"
    />
    <pasta-form-tags-input
      v-model="tagToAddModel"
      :must-become-empty-on-add="props.mustTagModelBecomeEmptyOnAdd"
      @add-tag="(tag) => emit('addTag', tag)"
    >
      <template #addTagSuggestions>
        <!--   NOTE: TRIED to use <option :value="tag" ...otherAttrs><{{'important message'}}/option>  
        but it did fail because firefox showed slot value only (no 'important message'), which is not what wanted
        chrome however works great, showing value attribute with smaller slot text below 
        SO implemented <option /> uses value, label and no slot, which works ok:
        firefox shows label only, value used onclick
        chrome shows value and label below, value used onclick -->
        <option
          v-for="[tag, count] of props.hintedTagsMap"
          :key="tag"
          :value="tag"
          :label="$t('pasta.create.tags.hint', { tag, count })"
        />
      </template>
    </pasta-form-tags-input>
  </div>
</template>
<script lang="ts" setup>
const tagToAddModel = defineModel<string>("tag", { default: "" });
const pastaTextModel = defineModel<string>("text", { required: true });

const trimmedText = computed(() => trimPastaText(pastaTextModel.value));

const props = defineProps<{
  pastaTags: BasePasta["tags"];
  mustTagModelBecomeEmptyOnAdd?: boolean;
  hintedTagsMap: [tagValue: string, tagCount: number][];
}>();

const emit = defineEmits<{
  addTag: [tag: string];
  removeTag: [tag: string];
  removeAllTags: [];
  createPasta: [];
}>();

const pastaFormTextareaRef = ref<HTMLInputElement>();

defineExpose({
  pastaFormTextareaRef,
});

const pastaStatus = computed(() => {
  const length = trimmedText.value.length;
  if (length === 0 || length > 1000) {
    return "error";
  }
  if (length > 500) {
    return "warning";
  }
  return "success";
});

const pastaLengthClassRecord = {
  error: "text-error",
  warning: "text-warning",
  success: "text-success",
};
</script>
