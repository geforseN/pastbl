<template>
  <div
    class="mt-2 flex flex-col items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <slot name="leftColumn">
      <chat-pasta-list>
        <template #creatorData>
          <chat-pasta-creator-data
            :badges-count="userStore.user.badges.count.state"
            :nickname="userStore.user.nickname.text.state"
            :nickname-color="userStore.user.debounced.nickname.color"
          />
        </template>
      </chat-pasta-list>
    </slot>
    <slot />
  </div>
</template>
<script setup lang="ts">
const userStore = useUserStore();
</script>
