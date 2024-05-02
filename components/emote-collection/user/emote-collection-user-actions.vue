<template>
  <div class="space-y-0.5 border border-red-500">
    <div class="flex items-center justify-between gap-1">
      <emote-collection-user-select-button
        :is-collection-selected
        size="sm"
        @select="emit('select')"
        @unselect="emit('unselect')"
      />
      <emote-collection-user-delete-button-dialog
        v-slot="dialog"
        class="-left-[11.5rem] top-8"
        @delete="emit('delete')"
      >
        <emote-collection-user-delete-button
          :disabled="dialog.isRevealed"
          size="sm"
          class="gap-0.5 border border-error-content"
          @click="dialog.reveal"
        />
      </emote-collection-user-delete-button-dialog>
    </div>
    <div class="flex justify-between">
      <span class="mx-2">
        {{
          $t(
            isCollectionSelected
              ? "userCollection.selected"
              : "userCollection.notSelected",
          )
        }}
      </span>
      <emote-collection-refresh-button
        :is-parent-refreshing="isCollectionRefreshing"
        size="sm"
        class="gap-0.5"
        @click="emit('refresh')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  isCollectionSelected: boolean;
  isCollectionRefreshing: boolean;
}>();

const emit = defineEmits<{
  refresh: [];
  delete: [];
  select: [];
  unselect: [];
}>();
</script>
