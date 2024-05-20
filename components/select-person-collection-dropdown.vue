<template>
  <div
    :class="$screen.isDidBrr ? 'dropdown-left' : 'dropdown-top'"
    class="dropdown dropdown-end"
  >
    <div
      tabindex="0"
      role="button"
      class="btn btn-sm flex-nowrap border-twitch-accent text-base-content hover:bg-twitch-accent"
    >
      {{ $t("emotes.select") }}
      <icon name="ic:arrow-drop-down" class="min-h-5 min-w-5" size="20" />
    </div>
    <ul
      tabindex="0"
      class="menu dropdown-content z-10 grid max-h-52 w-max overflow-y-auto rounded-btn border-2 bg-base-100 shadow"
    >
      <li>
        <button class="btn btn-outline btn-sm" @click="$emit('select', '')">
          {{ $t("nobody") }}
        </button>
      </li>
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
  select: [LoginSource];
}>();
</script>
