<template>
  <menu
    class="menu dropdown-content z-20 w-36 rounded-btn border border-base-content bg-base-100 p-2"
  >
    <ul class="m-0 space-y-1 p-0">
      <li class="w-fit">
        <nuxt-link-locale
          class="btn btn-outline btn-sm h-fit flex-nowrap justify-between text-wrap text-start hover:bg-primary"
          :to="`/collections/users/${login}`"
        >
          {{ $t("collection.my") }}
          <icon name="carbon:link" size="16" class="min-h-4 min-w-4" />
        </nuxt-link-locale>
      </li>
      <li>
        <button
          class="btn btn-outline btn-sm h-fit flex-nowrap justify-between text-wrap text-start hover:bg-red-500"
          @click="emit('logout')"
        >
          {{ $t("logout") }}
          <icon name="ic:baseline-log-out" size="16" class="min-h-4 min-w-4" />
        </button>
      </li>
    </ul>
  </menu>
</template>
<script setup lang="ts">
defineProps<{
  login: TwitchUserLogin;
}>();

const emit = defineEmits<{
  logout: [];
}>();
</script>
