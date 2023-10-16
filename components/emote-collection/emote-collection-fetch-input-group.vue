<template>
  <div class="grid w-full grid-cols-1 p-2">
    <label class="label" for="user-emote-collections">
      <span class="text-xl font-medium">Load twitch user</span>
    </label>
    <div class="join">
      <input
        class="input join-item input-primary w-full"
        id="user-emote-collections"
        v-model="userNickname"
        type="text"
        placeholder="Enter twitch nickname"
      />
      <button
        class="btn btn-primary join-item w-40 max-w-[40%]"
        @click="emitLoadCollections(userNickname)"
        :disabled="props.isCollectionsLoading"
      >
        {{ props.isCollectionsLoading ? "loading" : "load" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const userNickname = defineModel("nickname", { required: true, type: String });

const props = defineProps<{
  isCollectionsLoading: boolean;
}>();

const emit = defineEmits<{
  "load-collections": [];
}>();

const toast = useToast();

watchDebounced(userNickname, emitLoadCollections, { debounce: 1_500 });

function emitLoadCollections(userNickname: string) {
  if (!userNickname.length) {
    return;
  }
  if (props.isCollectionsLoading) {
    return void toast.add({
      description: "Collections already loading",
      title: "Error",
    });
  }
  emit("load-collections");
}
</script>

<style></style>
