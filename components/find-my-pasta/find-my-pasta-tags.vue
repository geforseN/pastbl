<template>
  <section>
    <label for="selected-pasta-tags" class="cursor-pointer">
      <h2>Select tags</h2>
    </label>
    <input
      list="selected-pasta-tags-hints"
      type="search"
      class="input input-primary input-xs mb-1 w-full"
    />
    <datalist id="selected-pasta-tags-hints">
      <option v-for="tag of props.pastaTagsToShow" :key="tag" :value="tag" />
    </datalist>
    <select
      id="selected-pasta-tags"
      v-model="selectedTagsModel"
      :disabled="props.mustSelectBeDisabled"
      multiple
      class="select select-primary !h-40 w-full p-2"
    >
      <option
        v-for="tag of props.pastaTagsToShow"
        :key="tag"
        :value="tag"
        class="h-6 p-1 odd:bg-base-300"
      >
        {{ tag }}
      </option>
    </select>

    <div>
      <span class="font-bold text-warning">NOTE:</span>
      for select multiple tags on PC use
      <span><kbd class="kbd kbd-sm">CTRL</kbd> + click</span>
    </div>
  </section>
</template>
<script setup lang="ts">
const selectedTagsModel = defineModel<string[]>("selectedPastaTags", {
  required: true,
});
const props = defineProps<{
  pastaTagsToShow: string[];
  mustSelectBeDisabled: boolean;
  allTags?: string[];
}>();
</script>
