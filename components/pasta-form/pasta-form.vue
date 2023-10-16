<template>
  <section
    class="flex flex-col gap-y-2 rounded border-2 border-base-content p-2"
  >
    <slot name="header" />
    <div
      class="flex w-min flex-col gap-2 xl:w-full xl:flex-row xl:justify-between"
    >
      <slot name="textarea" />
      <div class="flex items-center gap-1 xl:w-full xl:flex-col">
        <div>
          <pasta-form-pasta-length
            :class="textClass[pastaStatus]"
            :pasta-text="pastaText"
          />
          <div class="invisible mt-auto" />
          <button
            class="btn btn-error btn-sm"
            v-if="props.pastaTags.length !== 0"
            @click="() => emit('removeAllTags')"
          >
            remove all tags
          </button>
          <span class="badge badge-warning badge-lg" v-else>No tags added</span>
        </div>
        <div class="invisible ml-auto mt-auto" />
        <slot
          name="button"
          :pastaStatus="pastaStatus"
          :outlineClass="outlineClass"
        />
      </div>
    </div>
    <pasta-form-tags
      @remove-tag="(tag) => emit('removeTagFromPasta', tag)"
      :tags="props.pastaTags"
    />
    <pasta-form-tags-input
      v-model="tagToAdd"
      @add-tag="(tagToAdd) => emit('addTagToPasta', tagToAdd)"
      :should-become-empty="props.shouldTagModelBecomeEmpty"
    />
  </section>
</template>
<script lang="ts" setup>
const tagToAdd = defineModel<string>("tag", { default: "", local: true });
const pastaText = defineModel<string>("text", { required: true, local: false });

defineSlots<{
  header: () => VNode;
  button: (props: {
    pastaStatus: PastaStatus;
    outlineClass: Record<PastaStatus, string>;
  }) => VNode;
  textarea: () => VNode;
}>();

const props = defineProps<{
  pastaTags: Pasta["tags"];
  shouldTagModelBecomeEmpty?: boolean;
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

const pastaStatus = computed<PastaStatus>(() => {
  if (pastaText.value.length === 0 || pastaText.value.length > 1000) {
    return "error";
  }
  if (pastaText.value.length > 500) {
    return "warning";
  }
  return "success";
});

const textClass: Record<PastaStatus, string> = {
  error: "text-error",
  warning: "text-warning",
  success: "text-success",
};

const outlineClass: Record<PastaStatus, string> = {
  error: "focus-within:outline-error",
  warning: "focus-within:outline-warning",
  success: "focus-within:outline-success",
};
</script>
