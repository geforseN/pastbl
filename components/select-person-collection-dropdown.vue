<template>
  <div
    :class="$screen.isDidBrr ? 'dropdown-left' : 'dropdown-top'"
    class="dropdown dropdown-end"
  >
    <div tabindex="0" role="button" class="btn">
      {{ $t("select") }}
      <icon name="ic:arrow-drop-down" class="min-w-6" size="24" />
    </div>
    <ul
      tabindex="0"
      class="menu dropdown-content z-10 grid max-h-52 w-max overflow-y-auto rounded-btn border-2 bg-base-100 shadow"
    >
      <li><add-emotes-button-link /></li>
      <li
        v-for="collection of collections"
        :key="collection.user.twitch.login"
        class="odd:bg-base-300"
      >
        <person-to-select-button
          :twitch="collection.user.twitch"
          @click="$emit('select', collection)"
        />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import type { IUserEmoteCollection } from "~/integrations";

defineProps<{
  collections: IUserEmoteCollection[];
}>();

defineEmits<{
  select: [IUserEmoteCollection];
}>();
</script>
