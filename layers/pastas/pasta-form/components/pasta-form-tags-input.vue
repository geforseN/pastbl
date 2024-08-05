<template>
  <div class="flex flex-col">
    <div class="join">
      <input
        id="add-tag"
        v-model="modelValue"
        class="input join-item input-bordered box-content w-full border-base-content placeholder:text-base-content/80 empty:pr-0 xl:w-auto xl:min-w-[320px]"
        :class="isTagTooLong && 'border-error focus:outline-error'"
        type="text"
        :placeholder="$t('pasta-form-tags-input.placeholder')"
        list="add-tag-suggestions"
        @keyup="
          (event) => {
            if (event.key === ',') {
              tryAddTagOnCommaPress(event);
            }
          }
        "
        @keyup.enter.prevent="emitTag"
      />
      <client-only>
        <datalist id="add-tag-suggestions">
          <slot name="addTagSuggestions" />
        </datalist>
      </client-only>
      <button
        class="btn btn-info join-item box-content grow px-2"
        :class="
          modelValue.trimStart().startsWith('@') &&
          'border-twitch-accent bg-twitch-accent text-twitch-base hover:border-twitch-accent hover:bg-twitch-accent/90 focus:outline-twitch-accent'
        "
        @click.prevent="emitTag"
      >
        <span class="text-xl">+</span>
        {{ $t("tag.add") }}
      </button>
    </div>
    <!-- TODO: show note that on ',' will add tag -->
    <!-- TODO: show note that tag which starts with '@' will be user tag -->
    <!-- TODO: show note that tags.length > pastaTagsCount.max -->
    <span
      v-if="isTagTooLong"
      class="max-w-xs text-wrap break-words underline decoration-error"
    >
      {{ $t("toast.addTag.fail.tooLongMessage", appConfig.pastaTag.length) }}
    </span>
  </div>
</template>
<script setup lang="ts">
const appConfig = useAppConfig();

const modelValue = defineModel<string>({ required: true });

const isTagTooLong = computed(
  () => modelValue.value.length > appConfig.pastaTag.length.max,
);

const emit = defineEmits<{
  addTag: [string];
}>();

defineSlots<{
  addTagSuggestions: VueSlot;
}>();

function emitTag() {
  emit("addTag", modelValue.value);
}

function tryAddTagOnCommaPress(event: KeyboardEvent) {
  const input = modelValue.value;
  const commaIndex = input.indexOf(",");
  assert.ok(commaIndex >= 0);
  const tag = input.slice(0, commaIndex);
  emit("addTag", tag);
  // NOTE: must remove comma even if tag is empty
  modelValue.value = input.slice(commaIndex + 1);
  nextTick(() => {
    assert.ok(event.currentTarget instanceof HTMLInputElement);
    event.currentTarget.setSelectionRange(0, 0);
  });
}
</script>
