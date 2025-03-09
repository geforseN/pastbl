<template>
  <div
    :class="$screen.isDidBrr ? 'dropdown-left' : 'dropdown-top'"
    class="dropdown dropdown-end"
  >
    <div
      tabindex="0"
      role="button"
      class="btn btn-sm border-twitch-accent text-base-content hover:bg-twitch-accent flex-nowrap"
    >
      {{ $t("emotes.select") }}
      <icon
        name="ic:arrow-drop-down"
        class="min-h-5 min-w-5"
        size="20"
      />
    </div>
    <ul
      tabindex="0"
      class="menu dropdown-content rounded-btn bg-base-100 z-10 grid max-h-52 w-max overflow-y-auto border-2 shadow"
    >
      <li>
        <button
          class="btn btn-outline btn-sm"
          @click="$emit('select', '')"
        >
          {{ $t("nobody") }}
        </button>
      </li>
      <li
        v-for="collection of collections"
        :key="collection.person.twitch.login"
        class="odd:bg-base-300"
      >
        <person-to-select-button
          :twitch="collection.person.twitch"
          @click="$emit('select', collection)"
        />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  collections: TPersonEmoteCollection.Default[];
}>();

defineEmits<{
  select: [LoginSource];
}>();
</script>
