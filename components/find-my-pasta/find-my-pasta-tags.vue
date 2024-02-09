<template>
  <section class="collapse collapse-arrow border">
    <input type="checkbox" />
    <h2 class="collapse-title text-xl font-bold">{{ $t(ta + "heading") }}</h2>
    <div class="collapse-content flex flex-col gap-1">
      <article class="flex items-center justify-between">
        <label class="cursor-pointer" for="must-respect-selected-tags">
          <h3>{{ $t(ta + "must-respect") }}</h3>
        </label>
        <input
          id="must-respect-selected-tags"
          v-model="mustRespectSelectedTags"
          type="checkbox"
          class="toggle toggle-primary"
        />
      </article>
      <div>
        <select
          id="selected-pasta-tags"
          v-model="selectedPastaTags"
          v-auto-animate
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
          <span class="font-bold text-warning">{{ $t(h + "part1") }}</span>
          <span>
            &nbsp;{{ $t(h + "part2") }}&nbsp;
            <span class="inline-flex items-baseline">
              <kbd class="kbd kbd-sm">CTRL</kbd>
              &nbsp;+&nbsp;{{ $t(h + "part3") }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { f } from "~/components/find-my-pasta/find-my-pasta-params.vue";
</script>
<script setup lang="ts">
const ta = f + ("tags." as const);
const h = ta + "select-hint.";

const mustRespectSelectedTags = defineModel("mustRespectSelectedTags", {
  required: true,
  type: Boolean,
});

const selectedPastaTags = defineModel("selectedPastaTags", {
  required: true,
  type: Array<string>,
});

const props = defineProps<{
  tagsToSelect: string[];
}>();
</script>
