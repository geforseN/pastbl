<template>
  <div
    class="flex w-full grow bg-slate-600/20 2xl:max-w-sm"
    v-if="collections.ffz.state.value"
  >
    <img
      width="64"
      height="64"
      :src="collections.ffz.state.value.user.avatar"
      :alt="collections.ffz.state.value.user.display_name + ' avatar'"
    />
    <div class="ml-2">
      <template v-if="collections.ffz.state.value.user.badges">
        <img
          class="inline-block h-twitch-badge w-twitch-badge"
          v-for="badge of Object.values(collections.ffz.state.value.badges)"
          :style="{ backgroundColor: badge.color }"
          :src="badge.image"
          :alt="badge.title + ' badge'"
          :title="badge.title"
        />
      </template>
      <span class="ml-1">
        {{ collections.ffz.state.value.user.display_name }}
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps<{ collections: ReturnType<typeof useAsyncEmoteSets> }>();
</script>
