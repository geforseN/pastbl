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
        <slot name="button" :dynamicClass="createPastaButtonClass" />
        <div class="flex h-full flex-col justify-between">
          <pasta-form-pasta-length
            :class="pastaLengthClass[pastaStatus]"
            :pasta-text="pastaText.trim()"
          />
          <button
            class="btn btn-error btn-sm"
            v-if="props.pastaTags.length !== 0"
            @click="() => emit('removeAllTags')"
          >
            remove all tags
          </button>
          <span class="badge badge-warning badge-lg" v-else>No tags added</span>
        </div>
      </div>
    </div>
    <pasta-form-tags
      @remove-tag="(tag) => emit('removeTagFromPasta', tag)"
      :tags="props.pastaTags"
    />
    <pasta-form-tags-input
      v-model="tagToAdd"
      @add-tag="(tagToAdd) => emit('addTagToPasta', tagToAdd)"
      :should-become-empty="props.shouldTagModelBecomeEmptyOnAdd"
    />
  </section>
</template>
<script lang="ts" setup>
const tagToAdd = defineModel<string>("tag", { default: "", local: true });
const pastaText = defineModel<string>("text", { required: true, local: false });

defineSlots<{
  header: () => VNode;
  button: (props: { dynamicClass: string }) => VNode;
  textarea: () => VNode;
}>();

const props = defineProps<{
  pastaTags: Pasta["tags"];
  shouldTagModelBecomeEmptyOnAdd?: boolean;
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
