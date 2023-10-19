<template>
  <section class="divide-y-2 border-2 border-base-content p-2">
    <h2 class="p-2 text-3xl font-bold">Load emote collection</h2>
    <form action="" @submit.prevent="goToEmoteCollectionsPage">
      <div class="form-control p-2">
        <label class="label" for="user-to-load-collections-nickname">
          <span class="label-text text-xl font-medium">
            Enter user Twitch nickname
          </span>
        </label>
        <div
          class="join focus-within:outline focus-within:outline-2 focus-within:outline-base-content"
        >
          <input
            class="input join-item input-bordered w-full border-twitch hover:bg-base-300 focus:bg-base-300 focus:outline focus:outline-2 focus:outline-twitch"
            id="user-to-load-collections-nickname"
            v-model="userToLoadCollectionsNickname"
            placeholder="e.g. UselessMouth"
            type="text"
            name="user-to-load-collections-nickname"
            @focus="showHelpText = true"
            @blur="showHelpText = false"
            @keypress.enter.exact="goToEmoteCollectionsPage"
          />
          <button
            class="btn join-item border-twitch bg-twitch hover:bg-twitch/90 focus:border-l-2 focus:border-black focus:outline focus:outline-2 focus:outline-twitch"
            type="submit"
            @focus="showHelpText = true"
            @blur="showHelpText = false"
          >
            Load
          </button>
        </div>
        <label
          class="label-text mt-1 text-xs opacity-75"
          :class="
            showHelpText && userToLoadCollectionsNickname.trim().length
              ? 'visible'
              : 'invisible'
          "
          for="user-to-load-collections-nickname"
        >
          Now you can press
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
