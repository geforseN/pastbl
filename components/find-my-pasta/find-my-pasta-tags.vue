<template>
  <section class="collapse collapse-arrow border">
    <input type="checkbox" />
    <h2 class="collapse-title text-xl font-bold">Tags to include</h2>
    <div class="collapse-content flex flex-col gap-1">
      <article class="flex items-center justify-between">
        <label class="cursor-pointer" for="must-respect-selected-tags">
          <h3>Take into account selected tags</h3>
        </label>
        <input
          id="must-respect-selected-tags"
          v-model="mustRespectSelectedTags"
          type="checkbox"
          class="toggle toggle-primary"
        />
      </article>
      <!-- <article class="flex items-center justify-between">
        <label class="cursor-pointer" for="must-be-tags-in-pasta">
          <h3>
            Must be at least
            <input
              v-model="minimalTagsCountToHave"
              type="number"
              class="w-6"
              min="1"
              max="10"
            />
            <template v-if="minimalTagsCountToHave === 1">tag</template>
            <template v-else>tags</template>
          </h3>
        </label>
        <input
          id="must-be-tags-in-pasta"
          v-model="mustRespectedMinimalTagsCount"
          type="checkbox"
          class="toggle toggle-primary"
        />
      </article> -->
      <div>
        <select
          id="selected-pasta-tags"
          v-model="selectedPastaTags"
          :disabled="!mustRespectSelectedTags"
          multiple
          class="select select-primary !h-40 w-full p-2"
        >
          <option
            v-for="tag of props.tagsToSelect"
            :key="tag"
            :value="tag"
            class="h-6 p-1 odd:bg-base-300"
          >
            {{ tag }}
          </option>
        </select>
        <div class="px-1">
          <span class="font-bold text-warning">NOTE:</span>
          <span>
            &nbsp;for select multiple tags use&nbsp;
            <span class="inline-flex items-baseline">
              <kbd class="kbd kbd-sm">CTRL</kbd>&nbsp;+&nbsp;click
            </span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const mustRespectedMinimalTagsCount = defineModel(
  "mustRespectedMinimalTagsCount",
  {
    required: true,
    type: Boolean,
  },
);
const mustRespectSelectedTags = defineModel("mustRespectSelectedTags", {
  required: true,
  type: Boolean,
});

const selectedPastaTags = defineModel("selectedPastaTags", {
  required: true,
  type: Array<string>,
});

const minimalTagsCountToHave = defineModel("minimalTagsCountToHave", {
  required: true,
  type: Number,
});

const props = defineProps<{
  tagsToSelect: string[];
}>();
</script>
