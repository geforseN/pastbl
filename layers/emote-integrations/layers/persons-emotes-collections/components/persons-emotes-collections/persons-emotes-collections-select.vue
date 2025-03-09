<template>
  <section class="rounded-box space-y-2 border-2 p-2">
    <h2 class="p-2 text-3xl font-bold">
      {{ $t("collections.users.select.heading") }}
    </h2>
    <select
      id="user-collection"
      v-model="personsEmoteCollections.selectedLogin.state"
      name="user-collection"
      class="select select-info w-full"
    >
      <option value="">
        {{ $t("collections.users.select.no-select") }}
      </option>
      <option
        v-for="login of personsEmoteCollections.loginsToSelect.state"
        :key="login"
      >
        {{ login }}
      </option>
    </select>
    <person-emotes-collection-selected />
  </section>
</template>
<script setup lang="ts">
const personsEmoteCollections = usePersonsEmoteCollectionsStore();
</script>
