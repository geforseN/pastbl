<template>
  <div
    v-if="collections.ffz.partialCollection.state.value"
    class="flex bg-slate-600/20"
  >
    <img
      width="64"
      height="64"
      :src="collections.ffz.partialCollection.state.value.owner.avatarUrl"
      :alt="
        collections.ffz.partialCollection.state.value.owner.displayName +
        ' avatar'
      "
    />
    <div class="ml-2">
      <img
        v-for="badge of collections.ffz.partialCollection.state.value.owner
          .badges"
        :key="badge.id"
        class="inline-block h-twitch-badge w-twitch-badge"
        :style="{ backgroundColor: badge.color }"
        :src="badge.url"
        :alt="badge.title + ' badge'"
        :title="badge.title"
      />
      <span class="ml-1">
        {{ collections.ffz.partialCollection.state.value.owner.displayName }}
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps<{ collections: ReturnType<typeof useUserIntegrations> }>();
</script>
