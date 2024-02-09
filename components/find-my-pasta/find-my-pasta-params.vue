<template>
  <section class="flex w-full flex-col gap-1 rounded-box border-2 p-2">
    <h2 id="heading" class="p-2 text-2xl font-bold xs:text-3xl">
      {{ $t(f + "heading") }}
    </h2>
    <article class="form-control rounded-box border p-2">
      <label for="text-to-find" class="cursor-pointer">
        <h3 class="p-2 text-xl font-bold">{{ $t(f + "text-to-find") }}</h3>
      </label>
      <input
        id="text-to-find"
        ref="textToFindInputRef"
        v-model="pastaFindStore.text"
        type="search"
        class="input input-secondary m-1 -mt-1 border-2"
      />
    </article>
    <find-my-pasta-length-range
      v-model="pastaFindStore.length.range"
      v-model:max-value="pastaFindStore.length.max"
      v-model:min-value="pastaFindStore.length.min"
      v-model:respect="pastaFindStore.mustRespectLengthRange"
    />
    <find-my-pasta-tags
      v-model:must-respect-selected-tags="
        pastaFindStore.mustRespectSelectedTags
      "
      v-model:selected-pasta-tags="pastaFindStore.selectedPastaTags"
      :tags-to-select="pastaFindStore.tagsToSelect"
    />
    <dev-only>
      <find-my-pasta-date />
    </dev-only>
  </section>
</template>
<script lang="ts">
export const f = "pasta.find." as const;
</script>
<script lang="ts" setup>
const pastaFindStore = usePastaFindStore();
</script>
