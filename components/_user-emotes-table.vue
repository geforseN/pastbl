<template>
  <VaDataTable :columns="columns" :items="items">
    <template #header(BetterTTV)>
      <icon-emote-integration-logo
        :source="'BetterTTV'"
        width="24"
        height="24"
      />
    </template>
    <template #header(SevenTV)>
      <icon-emote-integration-logo :source="'SevenTV'" width="24" height="24" />
    </template>
    <template #header(FrankerFaceZ)="">
      <icon-emote-integration-logo
        :source="'FrankerFaceZ'"
        width="24"
        height="24"
      />
    </template>
    <template #cell(BetterTTV)="{ rowIndex }">
      {{
        items[rowIndex].collections.BetterTTV.sets
          .map((set) => set.emoteIds.length)
          .join(", ")
      }}
    </template>
    <template #cell(FrankerFaceZ)="{ rowIndex }">
      {{ items[rowIndex].collections.FrankerFaceZ.sets[0].emoteIds.length }} /
      {{ items[rowIndex].collections.FrankerFaceZ.owner.maxEmotes }}
    </template>
    <template #cell(SevenTV)="{ rowIndex }">
      {{ items[rowIndex].collections.SevenTV.sets[0].emoteIds.length }} /
      {{ items[rowIndex].collections.SevenTV.owner.capacity }}
    </template>
  </VaDataTable>
</template>
<script setup lang="ts">
const collectionsStore = useCollectionsStore();

const items = computed(
  () => collectionsStore.users.collections.userCollections.state,
);
const columns = [
  { key: "twitch.nickname", label: "Nickname" },
  { key: "collections.BetterTTV", name: "BetterTTV" },
  { key: "collections.SevenTV", name: "SevenTV" },
  { key: "collections.FrankerFaceZ", name: "FrankerFaceZ" },
];
</script>
