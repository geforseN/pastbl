<template>
  <section class="flex flex-col h-max gap-y-2 p-2 border-2 border-base-content rounded">
    <!-- FIXME: had strange bug, dynamic classes in template, -->
    <!-- which used computed below, did not wanted to get required style -->
    <!-- probably tailwind did not added classes in bundle -->
    <!-- 
      so  
      <span :class="`text-${pastaLengthColor}`">
        {{ pastaText.length }}
      </span>
      did not have required color, text had base text color -->
    <div
      hidden
      class="focus-within:outline-error focus-within:outline-warning focus-within:outline-success"
    />
    <div hidden class="text-error text-warning text-success" />
    <!-- 
      UPD: above two hidden div elements with proper classes are added to fix classes can not came into bundle  
    -->
    <slot name="header" />
    <div class="flex gap-x-2">
      <twitch-chat
        ref="twitchChatRef"
        v-model="pastaText"
        @enter-pressed="emit('createPastaEnterPressed', $event)"
      />
      <div class="flex flex-col w-40 items-center">
        <slot name="topLeftElement" :pastaLengthColor="pastaLengthColor" />
        <span>
          Pasta length:
          <span :class="`text-${pastaLengthColor}`">
            {{ pastaText.length }}
          </span>
        </span>
        <div class="mt-auto invisible" />
        <button
          v-if="props.pastaTags.length !== 0"
          class="btn btn-sm btn-error"
          @click="() => emit('removeAllTags')"
        >
          remove all tags
        </button>
        <div v-else class="badge badge-lg badge-warning">
          No tags added
        </div>
      </div>
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
  topLeftElement: (props: {
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
