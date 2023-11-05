<template>
  <section
    class="flex flex-col gap-y-2 rounded border-2 border-base-content p-2"
  >
    <slot name="header" />
    <div
      class="flex w-min flex-col gap-2 xl:w-full xl:flex-row xl:justify-between"
    >
      <slot name="textarea" />
      <div
        class="flex flex-row-reverse items-center justify-between gap-1 xl:w-full xl:flex-col"
      >
        <slot name="button" :dynamic-class="createPastaButtonClass" />
        <div class="flex h-full flex-col justify-between">
          <pasta-form-pasta-length
            :class="pastaLengthClass[pastaStatus]"
            :pasta-text="pastaText.trim()"
          />
          <button
            v-if="props.pastaTags.length !== 0"
            class="btn btn-error btn-sm"
            @click="() => emit('removeAllTags')"
          >
            remove all tags
          </button>
          <span v-else class="badge badge-warning badge-lg">No tags added</span>
        </div>
      </div>
    </div>
    <pasta-form-tags
      :tags="props.pastaTags"
      @remove-tag="(tag) => emit('removeTagFromPasta', tag)"
    />
    <pasta-form-tags-input
      v-model="tagToAdd"
      :must-become-empty-on-add="props.mustTagModelBecomeEmptyOnAdd"
      @add-tag="(tagToAdd) => emit('addTagToPasta', tagToAdd)"
    >
      <template #addTagSuggestions>
        <!--   NOTE: TRIED to use <option :value="tag" ...otherAttrs><{{'important message'}}/option>  
        but it did fail because firefox showed slot value only (no 'important message'), which is not what wanted
        chrome however works great, showing value attribute with smaller slot text below 
        SO implemented <option /> uses value, label and no slot, which works ok:
        firefox shows label only, value used onclick
        chrome shows value and label below, value used onclick -->
        <option
          v-for="[tag, count] of pastasStore.mostPopularTagsMap"
          :key="tag"
          :value="tag"
          :label="`${tag}, was used ${count} ${count === 1 ? 'time' : 'times'}`"
        />
      </template>
    </pasta-form-tags-input>
  </section>
</template>
<script lang="ts" setup>
const tagToAdd = defineModel<string>("tag", { default: "", local: true });
const pastaText = defineModel<string>("text", { required: true, local: false });

const pastasStore = usePastasStore();

defineSlots<{
  header: () => VNode;
  button: (props: { dynamicClass: string }) => VNode;
  textarea: () => VNode;
}>();

const props = defineProps<{
  pastaTags: Pasta["tags"];
  mustTagModelBecomeEmptyOnAdd?: boolean;
}>();

const emit = defineEmits<{
  addTagToPasta: [tag: string];
  removeTagFromPasta: [tag: string];
  removeAllTags: [];
}>();

const twitchChatRef = ref<HTMLInputElement>();

defineExpose({
  twitchChatRef,
});

type PastaStatus = "error" | "warning" | "success";

const pastaStatus = computed(() => {
  const pastaTextLength = pastaText.value.trim().length;

  if (pastaTextLength === 0 || pastaTextLength > 1000) {
    return "error" satisfies PastaStatus;
  }
  if (pastaTextLength > 500) {
    return "warning" satisfies PastaStatus;
  }
  return "success" satisfies PastaStatus;
});

const pastaLengthClass = {
  error: "text-error",
  warning: "text-warning",
  success: "text-success",
};

const createPastaButtonClass = computed(() => {
  switch (pastaStatus.value) {
    case "error":
      return "bg-error focus:outline-error hover:bg-error/80";
    case "warning":
      return "bg-warning focus:outline-warning hover:bg-warning/80";
    case "success":
      return "bg-success focus:outline-success hover:bg-success/80";
  }
});
</script>
