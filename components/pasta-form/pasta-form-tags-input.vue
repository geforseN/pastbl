<template>
  <div class="join w-full">
    <input
      id="add-tag"
      v-model="modelValue"
      class="input join-item input-bordered box-content w-full border-base-content placeholder:text-base-content xl:w-auto xl:min-w-[320px]"
      type="text"
      :placeholder="$t('pasta.create.tag.input-placeholder')"
      list="add-tag-suggestions"
      @keyup.enter.prevent="emitTag"
    />
    <datalist id="add-tag-suggestions">
      <slot name="addTagSuggestions" />
    </datalist>
    <button
      class="btn btn-secondary join-item box-content grow border border-base-content px-2 text-3xl text-base-content hover:border hover:border-base-content hover:bg-secondary/5 xl:min-w-[160px] xl:px-0"
      @click.prevent="emitTag"
    >
      +
      <span class="text-base">
        {{ $t("pasta.create.tag.add-button") }}
      </span>
    </button>
  </div>
</template>
<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });

const { mustBecomeEmptyOnAdd = false } = defineProps<{
  mustBecomeEmptyOnAdd?: boolean;
}>();
const emit = defineEmits<{ addTag: [tagToAdd: string] }>();

defineSlots<{
  addTagSuggestions: () => unknown;
}>();

function emitTag() {
  emit("addTag", modelValue.value);
  if (mustBecomeEmptyOnAdd) {
    modelValue.value = "";
  }
}
</script>
