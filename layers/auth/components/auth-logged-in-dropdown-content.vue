<template>
  <menu
    class="menu dropdown-content rounded-btn border-base-content bg-base-100 z-20 w-36 border p-2"
  >
    <ul class="m-0 space-y-1 p-0">
      <li class="w-fit">
        <person-emotes-collection-link
          :login
          class="btn btn-outline btn-sm hover:bg-primary h-fit flex-nowrap justify-between text-wrap text-start"
        >
          {{ $t("collection.my") }}
          <icon
            name="carbon:link"
            size="16"
            class="min-h-4 min-w-4"
          />
        </person-emotes-collection-link>
      </li>
      <li>
        <button
          class="btn btn-outline btn-sm h-fit flex-nowrap justify-between text-wrap text-start hover:bg-red-500"
          @click="$emit('logout')"
        >
          {{ $t("logout") }}
          <icon
            name="ic:baseline-log-out"
            size="16"
            class="min-h-4 min-w-4"
          />
        </button>
      </li>
    </ul>
  </menu>
</template>
<script setup lang="ts">
defineProps<{
  login: TwitchUserLogin;
}>();

defineEmits<{
  logout: [];
}>();
</script>
