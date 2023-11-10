<template>
  <table class="table table-xs go-brr:table-md">
    <caption class="table-caption p-2 text-left text-lg">
      Global emotes
    </caption>
    <thead>
      <tr>
        <th>Logo</th>
        <th>Name</th>
        <th>Active</th>
        <th>Update time</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody v-for="[source, collection] of props.entries" :key="source">
      <tr>
        <td>
          <icons-emote-integration-logo :source="source" />
        </td>
        <td>
          {{ source }}
        </td>
        <td>
          <div>
            <label for="7tv-active" class="sr-only">
              Make {{ source }} active
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
