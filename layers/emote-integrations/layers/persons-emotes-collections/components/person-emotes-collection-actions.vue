<template>
  <div class="divide-y rounded-btn border-2 border-info">
    <div class="flex justify-between p-1">
      <refresh-button
        :is-in-process="isCollectionRefreshing"
        size="sm"
        class="gap-0.5"
        @click="$emit('refresh')"
      />
      <person-emotes-collection-delete-button-dialog
        v-slot="dialog"
        class="-left-[11.5rem] top-8"
        @delete="$emit('delete')"
      >
        <person-emotes-collection-delete-button
          :disabled="dialog.isRevealed"
          size="sm"
          class="gap-0.5 border border-error-content"
          @click="dialog.reveal"
        />
      </person-emotes-collection-delete-button-dialog>
    </div>
    <div class="flex items-center justify-between p-1">
      <output class="mx-2">
        {{
          $t(
            isCollectionSelected
              ? "userCollection.selected"
              : "userCollection.notSelected",
          )
        }}
      </output>
      <person-emotes-collection-select-button
        :is-collection-selected
        size="sm"
        @click="isCollectionSelected ? $emit('unselect') : $emit('select')"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  isCollectionSelected: boolean;
  isCollectionRefreshing: boolean;
  // TODO: collection: {status: SomeEmoteCollection['status']};
}>();

defineEmits<{
  refresh: [];
  delete: [];
  select: [];
  unselect: [];
}>();
</script>
