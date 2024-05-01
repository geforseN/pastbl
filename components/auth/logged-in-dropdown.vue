<template>
  <div class="dropdown dropdown-end dropdown-hover">
    <div class="btn btn-outline w-36 flex-nowrap justify-start gap-1.5 p-2">
      <twitch-user-avatar :user :size="24" />
      <div
        class="line-clamp-2 w-[5.2rem] items-center text-ellipsis break-all text-start text-sm/tight"
        :title="user.nickname"
      >
        {{ user.nickname }}
      </div>
      <button class="absolute right-2">
        <icon name="ic:arrow-drop-down" size="20" />
      </button>
    </div>
    <auth-logged-in-dropdown-content
      :login="user.nickname"
      @logout="emit('logout')"
    />
  </div>
</template>
<script setup lang="ts">
defineProps<{
  user: TwitchUser;
}>();

const emit = defineEmits<{
  logout: [];
}>();
</script>
