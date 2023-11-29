<template>
  <table class="table table-pin-cols table-xs go-brr:table-md">
    <caption class="table-caption p-2 text-left text-lg">
      User emotes
    </caption>
    <thead>
      <tr>
        <th class="relative left-10">Name</th>
        <th>Active</th>
        <th>Update time</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody v-for="[nickname, collection] of props.entries" :key="nickname">
      <tr class="hover">
        <td>
          <div class="flex items-center gap-2">
            <div class="w-8">
              <img
                width="32"
                class="rounded-full"
                :src="collection.collections.FrankerFaceZ.owner.avatarUrl"
                :alt="`${nickname} avatar`"
              />
            </div>
            <div class="flex w-24 flex-col">
              <span class="nickname" :title="nickname">
                {{ nickname }}
              </span>
              <nuxt-link
                class="link text-xs text-twitch"
                :to="`https://www.twitch.tv/${collection.twitch.username}`"
              >
                Twitch
              </nuxt-link>
            </div>
          </div>
        </td>
        <td>
          <div class="flex justify-center">
            <label :for="'isActive' + nickname" class="sr-only">
              Make {{ nickname }} emote collection active
            </label>
            <!-- TODO make value binding -->
            <input
              :id="'isActive' + nickname"
              v-model="collectionsStore.activeUserCollectionNickname"
              :value="nickname"
              type="radio"
              name="isActiveUserCollection"
              class="radio-accent radio"
            />
          </div>
        </td>
        <td>
          <use-time-ago #="{ timeAgo }" :time="collection.updatedAt">
            <span :title="new Date(collection.updatedAt).toString()">
              {{ timeAgo }}
            </span>
          </use-time-ago>
        </td>
        <td>
          <div class="flex flex-col justify-center">
            <button
              class="btn btn-accent btn-xs flex-nowrap"
              @click="collectionsStore.refreshUserCollection(collection)"
            >
              <icon
                name="material-symbols-light:refresh-rounded"
                class="-mx-[5px]"
              />
              Refresh
            </button>
            <button
              class="btn btn-error btn-xs flex-nowrap"
              @click="collectionsStore.removeUserCollection(collection)"
            >
              <icon
                name="material-symbols-light:cancel-outline"
                class="-mx-[5px]"
              />
              Remove
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import { UseTimeAgo } from "@vueuse/components";
import type { IndexedDBUserCollection } from "~/client-only/IndexedDB";

const props = defineProps<{
  entries: [
    IndexedDBUserCollection["twitch"]["nickname"],
    IndexedDBUserCollection,
  ][];
}>();

const collectionsStore = useCollectionsStore();
</script>
<style scoped>
.nickname {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
