<template>
  <section class="flex flex-col gap-2 rounded-box border-2 p-2">
    <h2 class="p-2 text-3xl font-bold">
      {{ $t("collections.users.select.heading") }}
    </h2>
    <select
      id="user-collection"
      v-model="userCollectionsStore.selectedLogin.state"
      name="user-collection"
      class="select select-info w-full"
    >
      <option value="">{{ $t("collections.users.select.no-select") }}</option>
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
