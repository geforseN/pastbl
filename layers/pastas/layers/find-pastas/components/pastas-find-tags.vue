<template>
  <section class="collapse collapse-arrow border">
    <input type="checkbox" />
    <h2 class="collapse-title text-xl font-bold">
      {{ $t("pasta.find.tags.heading") }}
    </h2>
    <div class="collapse-content space-y-1">
      <article class="flex items-center justify-between">
        <label
          class="cursor-pointer"
          for="must-respect-selected-tags"
        >
          <h3>{{ $t("pasta.find.tags.must-respect") }}</h3>
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
            v-for="tag of tagsToSelect"
            :key="tag"
            :value="tag"
            class="h-6 p-1 odd:bg-base-300"
          >
            {{ tag }}
          </option>
        </select>
        <div class="px-1">
          <span class="font-bold text-warning">{{ $t("note") }}: </span>
          <i18n-t
            keypath="pasta.find.tags.select-hint"
            tag="span"
          >
            <span class="inline-flex items-baseline gap-x-0.5">
              <kbd class="kbd kbd-sm">CTRL</kbd>
              +
              <span>{{ $t("click") }}</span>
            </span>
          </i18n-t>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const mustRespectSelectedTags = defineModel<boolean>(
  "mustRespectSelectedTags",
  { required: true },
);

const selectedPastaTags = defineModel<string[]>("selectedPastaTags", {
  required: true,
});

defineProps<{
  tagsToSelect: string[];
}>();
</script>
