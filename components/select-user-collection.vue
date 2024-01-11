<template>
  <section class="rounded-box border-2 p-2">
    <h2 class="p-2 text-3xl font-bold">Select user collection</h2>
    <select
      id="user-collection"
      ref="selectRef"
      name="user-collection"
      class="select select-info w-full"
      @input="handleCollectionSelect"
    >
      <option value="">No selected user collection</option>
      <option
        v-for="username of userCollectionsStore.usernamesToSelect.state"
        :key="username"
        :value="username"
        :selected="userCollectionsStore.isSelectedUsername(username)"
      >
        {{ username }}
      </option>
    </select>
    <div v-if="selectedCollection === null" class="p-2 font-bold">
      No user collection selected
    </div>
    <div v-else class="mt-2">
      <span class="px-2 font-bold">Selected user collection:</span>
      <user-emote-collection-btnlike
        class="rounded-btn border-2 border-twitch p-2"
        :nickname="selectedCollection.twitch.nickname"
        :avatar-url="
          selectedCollection.integrations.FrankerFaceZ?.owner.avatarUrl
        "
        @delete="
          userCollectionsStore.deleteCollection(selectedCollectionUsername)
        "
        @refresh="
          userCollectionsStore.refreshCollection(selectedCollectionUsername)
        "
      />
    </div>
  </section>
</template>
<script setup lang="ts">
const userCollectionsStore = useUserCollectionsStore();

const selectRef = ref<HTMLSelectElement>();

const selectedCollection = computed(
  () => userCollectionsStore.selectedCollection.state,
);

const selectedCollectionUsername = computed(
  () => selectedCollection.value?.twitch.username || "",
);

async function handleCollectionSelect(event: Event) {
  const { value: nickname } = event.currentTarget as HTMLSelectElement;
  await userCollectionsStore.selectCollection(nickname);
  selectRef.value?.focus();
}
</script>
