<template>
  <div class="join w-full">
    <input
      id="add-tag"
      v-model="modelValue"
      class="input join-item input-bordered box-content w-full border-base-content placeholder:text-base-content/80 empty:pr-0 xl:w-auto xl:min-w-[320px]"
      type="text"
      :placeholder="$t('pasta.formCommon.tag.inputPlaceholder')"
      list="add-tag-suggestions"
      @keyup="
        (event) => {
          if (event.key === ',') {
            addTagOnCommaPress(event);
          }
        }
      "
      @keyup.enter.prevent="emitTag"
    />
    <datalist id="add-tag-suggestions">
      <slot name="addTagSuggestions" />
    </datalist>
    <button
      class="btn btn-secondary join-item box-content grow px-2"
      @click.prevent="emitTag"
    >
      <span class="text-xl">+</span>
      {{ $t("pasta.formCommon.tag.addButton") }}
    </button>
  </div>
</template>
<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });

const emit = defineEmits<{ addTag: [tagToAdd: string] }>();

defineSlots<{
  addTagSuggestions: () => unknown;
}>();

function emitTag() {
  emit("addTag", modelValue.value);
}

function addTagOnCommaPress(event: KeyboardEvent) {
  const input = modelValue.value;
  const commaIndex = input.indexOf(",");
  assert.ok(commaIndex >= 0);
  const tag = input.slice(0, commaIndex);
  if (tag.length !== 0) {
    emit("addTag", tag);
  }
  // NOTE: must remove comma even if tag is empty
  modelValue.value = input.slice(commaIndex + 1);
  nextTick(() => {
    assert.ok(event.currentTarget instanceof HTMLInputElement);
    event.currentTarget.setSelectionRange(0, 0);
  });
}
</script>
