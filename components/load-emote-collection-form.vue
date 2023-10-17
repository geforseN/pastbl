<template>
  <section class="divide-y-2 border-2 border-base-content p-2">
    <h2 class="p-2 text-3xl font-bold">Load emote collection</h2>
    <form action="" @submit.prevent="goToEmoteCollectionsPage">
      <div class="form-control p-2">
        <label class="label" for="user-to-load-collections-nickname">
          <span class="label-text text-xl font-medium"
            >User Twitch nickname</span
          >
        </label>
        <div class="join">
          <input
            class="input join-item input-bordered w-full border-twitch focus-within:outline-twitch"
            id="user-to-load-collections-nickname"
            v-model="userToLoadCollectionsNickname"
            placeholder="Enter twitch nickname"
            type="text"
            name="user-to-load-collections-nickname"
            @focus="showHelpText = true"
            @blur="showHelpText = false"
            @keypress.enter.exact="goToEmoteCollectionsPage"
          />
          <button
            class="btn join-item border-twitch bg-twitch focus-within:outline-twitch hover:bg-twitch/90"
            type="submit"
            @focus="showHelpText = true"
            @blur="showHelpText = false"
          >
            Load
          </button>
        </div>
        <label
          class="label-text mt-1 text-xs opacity-75"
          v-show="showHelpText && userToLoadCollectionsNickname.length"
          for="user-to-load-collections-nickname"
        >
          You can press
          <kbd class="kbd kbd-xs">enter</kbd>
          to load emote collection
        </label>
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
const userToLoadCollectionsNickname = ref("");

const showHelpText = ref(false);

function goToEmoteCollectionsPage() {
  return navigateTo({
    path: "/emote-collections",
    query: { nickname: userToLoadCollectionsNickname.value },
  });
}
</script>

<style></style>
