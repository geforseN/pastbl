<template>
  <section
    class="border-2 rounded border-base-content p-2 h-max w-min grid gap-y-2"
  >
    <slot name="header" />
    <twitch-chat
      ref="twitchChatRef"
      v-model="pastaText"
      @enter-pressed="emit('createPastaEnterPressed', $event)"
    />
    <div class="flex justify-between gap-x-1">
      <div>
        <span class="px-1.5">
          Pasta length:
          <span :class="`text-${pastaLengthColor}`">
            {{ pastaText.length }}
          </span>
        </span>
        <button
          v-if="props.pastaTags.length !== 0"
          class="btn btn-sm btn-error"
          @click="() => emit('removeAllTags')"
        >
          remove all tags
        </button>
        <span v-else class="badge badge-warning badge-lg"
          >No tags were added</span
        >
      </div>
      <slot name="button" :pastaLengthColor="pastaLengthColor" />
    </div>
    <added-tags
      @remove-tag="(tag) => emit('removeTagFromPasta', tag)"
      :tags="props.pastaTags"
    />
    <add-pasta-tags
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
    pastaLengthColor: "error" | "warning" | "success";
  }) => VNode;
}>();

const props = defineProps<{
  pastaTags: Pasta["tags"];
  shouldTagModelBecomeEmpty?: boolean;
}>();

const emit = defineEmits<{
  createPastaEnterPressed: [event: KeyboardEvent];
  addTagToPasta: [tag: string];
  removeTagFromPasta: [tag: string];
  removeAllTags: [];
}>();

const twitchChatRef = ref<HTMLInputElement>();

defineExpose({
  twitchChatRef,
});

const pastaLengthColor = computed(() => {
  if (pastaText.value.length === 0 || pastaText.value.length > 1000) {
    return "error";
  }
  if (pastaText.value.length > 500) {
    return "warning";
  }
  return "success";
});
</script>
