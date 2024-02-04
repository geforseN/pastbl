<template>
  <section class="flex flex-col gap-2 rounded-box border-2 p-2">
    <h2 class="p-2 text-3xl font-bold">Select user collection</h2>
    <select
      id="user-collection"
      v-model="userCollectionsStore.selectedCollectionLogin.state"
      name="user-collection"
      class="select select-info w-full"
    >
      <option value="">No selected user collection</option>
      <option
        v-for="login of userCollectionsStore.loginsToSelect.state"
        :key="login"
      >
        {{ login }}
      </option>
    </select>
    <user-collection-selected />
  </section>
</template>
<script setup lang="ts">
const userCollectionsStore = useUserCollectionsStore();
</script>
