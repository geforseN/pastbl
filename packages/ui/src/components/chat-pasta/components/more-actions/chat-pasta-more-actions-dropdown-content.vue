<template>
  <ul
    class="menu dropdown-content rounded-btn border-base-content bg-base-100 z-[1] flex w-max flex-row flex-wrap gap-1 border p-2 shadow"
  >
    <li>
      <chat-pasta-edit-button-link
        size="small"
        class="w-min"
        to="/pastas/edit/update-it"
      />
    </li>
    <li>
      <chat-pasta-remove-button
        size="small"
        class="w-min"
      />
    </li>
  </ul>
</template>
<script setup lang="ts">
import ChatPastaEditButtonLink from "../buttons/chat-pasta-edit-button-link.vue";
import ChatPastaRemoveButton from "../buttons/chat-pasta-remove-button.vue";
</script>
