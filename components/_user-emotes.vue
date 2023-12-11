<template>
  <div class="rounded-box border-2 p-2">
    <h2 id="user-emotes-heading" class="px-2 text-3xl font-bold">
      User Emotes
    </h2>
    <template v-if="collectionsStore.users.collections.userCollections.isReady">
      {{
        collectionsStore.users.collections.userCollections.state.map(
          (c) => c.twitch.nickname,
        )
      }}
      <div
        v-for="collection of collectionsStore.users.collections.userCollections
          .state"
        :key="collection.twitch.username"
        class="p-2"
      >
        <nuxt-link
          :to="'https://twitch.tv/' + collection.twitch.username"
          class="link"
        >
          <h3 class="text-xl font-bold">{{ collection.twitch.nickname }}</h3>
        </nuxt-link>
        <span class="link"></span>
        <img
          width="64"
          height="64"
          :src="collection.img.source"
          :alt="collection.twitch.nickname + ' avatar'"
        />
        <use-time-ago :time="collection.updatedAt" #="{ timeAgo }">
          <div>Emotes was loaded {{ timeAgo }}</div>
        </use-time-ago>
        <time datetime="">
          {{ new Date(collection.updatedAt).toLocaleDateString() }}
          {{ new Date(collection.updatedAt).toTimeString() }}
        </time>
        <div
          v-for="emoteCollection of collection.collections"
          :key="emoteCollection.source"
        >
          {{ emoteCollection.name }}
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { UseTimeAgo } from "@vueuse/components";

const collectionsStore = useCollectionsStore();
</script>
