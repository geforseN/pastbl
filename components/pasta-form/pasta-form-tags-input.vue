<template>
  <div class="join w-full">
    <input
      class="input join-item input-bordered box-content w-full border-base-content placeholder:text-base-content xl:w-auto xl:min-w-[320px]"
      id="add-tag"
      v-model="modelValue"
      type="text"
      @keyup.enter.prevent="emitTag"
      placeholder="Enter a pasta tag (optional)"
      list="add-tag-suggestions"
    />
    <datalist id="add-tag-suggestions">
      <!-- NOTE: 
        TRIED to use slot as 'was used {{ count }} {{ count === 1 ? "time" : "times" }}' and :value="tag"
        but it did failed because firefox showed slot value only, which is not what wanted
        chrome however works great, showing value attribute with smaller slot text below 
        SO implemented <option /> uses value, label and no slot, which works ok:
        firefox shows label only, value used onclick
        chrome shows value and label below, value used onclick
      -->
      <option
        v-for="[tag, count] of pastasStore.mostPopularTagsMap"
        :key="tag"
        :value="tag"
        :label="`${tag}, was used ${count} ${count === 1 ? 'time' : 'times'}`"
      />
    </datalist>
    <button
      class="btn btn-secondary join-item box-content border border-base-content px-2 text-3xl text-base-content hover:border hover:border-base-content hover:bg-secondary/5 xl:min-w-[160px] xl:px-0"
      @click.prevent="emitTag"
    >
      +
      <span class="text-base">add tag</span>
    </button>
  </div>
</template>
<script setup lang="ts">
const modelValue = defineModel<string>({ required: true });

const { shouldBecomeEmpty = false } = defineProps<{
  shouldBecomeEmpty?: boolean;
}>();
const emit = defineEmits<{ addTag: [tagToAdd: string] }>();

function emitTag() {
  emit("addTag", modelValue.value);
  if (shouldBecomeEmpty) {
    modelValue.value = "";
  }
}
// TODO: ? remove usePastasStore usage, add prop for it ?
const pastasStore = usePastasStore();
</script>
