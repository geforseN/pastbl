<template>
  <section class="w-full space-y-1 rounded-box border-2 p-2">
    <h2
      id="heading"
      class="p-2 text-2xl font-bold xs:text-3xl"
    >
      {{ $t("pasta.find.heading") }}
    </h2>
    <article class="form-control rounded-box border p-2">
      <label
        for="text-to-find"
        class="cursor-pointer"
      >
        <h3 class="p-2 text-xl font-bold">
          {{ $t("pasta.find.text-to-find") }}
        </h3>
      </label>
      <input
        id="text-to-find"
        ref="textToFindInputRef"
        v-model="pastaFindStore.text"
        type="search"
        class="input input-secondary m-1 -mt-1 border-2"
      />
    </article>
    <pastas-find-length-range
      v-model="pastaFindStore.length.range"
      v-model:max="pastaFindStore.length.max"
      v-model:min="pastaFindStore.length.min"
      v-model:respect="pastaFindStore.mustRespectLengthRange"
    />
    <pastas-find-tags
      v-model:must-respect-selected-tags="
        pastaFindStore.mustRespectSelectedTags
      "
      v-model:selected-pasta-tags="pastaFindStore.selectedPastaTags"
      :tags-to-select="pastaFindStore.tagsToSelect"
    />
    <pastas-find-date />
  </section>
</template>
<script setup lang="ts">
const pastaFindStore = usePastaFindStore();
</script>
