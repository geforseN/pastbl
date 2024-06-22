<template>
  <div class="chat-pasta__sidebar h-12">
    <div
      class="dropdown dropdown-left dropdown-top dropdown-hover !h-8 xs:h-auto"
    >
      <div
        tabindex="0"
        role="button"
        class="chat-pasta__sidebar-more-actions-button btn btn-square btn-primary btn-md w-8 border-2 border-primary-content"
      >
        <span class="more-vert-icon block">
          <icon name="ic:baseline-more-vert" />
        </span>
        <span class="more-horiz-icon hidden">
          <icon name="ic:baseline-more-horiz" />
        </span>
      </div>
      <ul
        tabindex="0"
        class="chat-pasta__sidebar-more-actions-list menu dropdown-content z-[1] flex w-max translate-x-[18%] flex-row flex-wrap gap-1 rounded-btn border border-base-content bg-base-100 p-2 shadow *:w-min"
      >
        <!-- eslint-disable vue/no-v-html -->
        <li>
          <button class="btn btn-info flex-nowrap" @click="$emit('edit')">
            <span v-html="$t('pasta.edit')" />
            <icon name="ic:outline-edit" size="24" class="min-h-6 min-w-6" />
          </button>
        </li>
        <li>
          <button class="btn btn-error flex-nowrap" @click="$emit('remove')">
            <span v-html="$t('pasta.remove')" />
            <icon
              name="ic:baseline-delete-outline"
              size="24"
              class="min-h-6 min-w-6"
            />
          </button>
        </li>
        <!-- eslint-enable vue/no-v-html -->
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
defineEmits<{
  remove: [];
  edit: [];
}>();
</script>
