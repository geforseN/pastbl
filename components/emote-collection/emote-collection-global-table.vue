<template>
  <table class="table table-xs go-brr:table-md">
    <caption class="table-caption p-2 text-left text-lg">
      Global emotes
    </caption>
    <thead>
      <tr>
        <th class="relative left-8">Name</th>
        <th>Active</th>
        <th>Update time</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody v-for="[source, collection] of props.entries" :key="source">
      <tr class="hover">
        <td class="flex items-center gap-2">
          <div class="w-6">
            <icons-emote-integration-logo width="24" :source="source" />
          </div>
          <span class="w-[6.5rem]">{{ source }}</span>
        </td>
        <td>
          <div>
            <label :for="'isActive' + source" class="sr-only">
              Make {{ collection.name }} active
            </label>
            <!-- TODO make value binding -->
            <input
              :id="'isActive' + source"
              type="checkbox"
              :name="'isActive' + source"
              class="checkbox-accent checkbox"
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
        <td><button class="btn btn-accent btn-xs">Update</button></td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import { UseTimeAgo } from "@vueuse/components";
import type { IGlobalEmoteCollection } from "~/integrations";

const props = defineProps<{
  entries: [IGlobalEmoteCollection["source"], IGlobalEmoteCollection][];
}>();
</script>
