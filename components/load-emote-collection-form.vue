<template>
  <section class="divide-y-2 border-2 border-base-content p-2">
    <h2 class="p-2 text-3xl font-bold">Load emote collection</h2>
    <form action="" @submit.prevent>
      <div class="form-control p-2">
        <label class="label" for="user-to-load-collections-nickname">
          <span class="label-text text-xl font-medium">
            Enter user Twitch nickname
          </span>
        </label>
        <div class="join">
          <input
            class="input join-item input-bordered w-full border-twitch invalid:bg-red-100 hover:bg-base-300 focus:bg-base-300 focus:outline focus:outline-2 focus:outline-twitch"
            id="user-to-load-collections-nickname"
            v-model="userNickname"
            placeholder="e.g. UselessMouth"
            type="text"
            pattern="^\s*(\S\s*){4,25}$"
            name="user-to-load-collections-nickname"
            @keypress.enter.exact="
              navigateTo({
                path: '/emote-collections',
                query: { nickname: trimmedUserNickname },
              })
            "
          />
          <nuxt-link
            class="btn join-item border-twitch bg-twitch hover:bg-twitch/90 focus:border-black focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-twitch"
            :to="{
              path: '/emote-collections',
              query: { nickname: trimmedUserNickname },
            }"
          >
            Load
          </nuxt-link>
        </div>
        <label
          class="label-text mt-1 text-xs"
          for="user-to-load-collections-nickname"
        >
          <span v-if="isValidUserNickname">
            Now you can press
            <kbd class="kbd kbd-xs">
              <nuxt-link
                :to="{
                  path: '/emote-collections',
                  query: { nickname: trimmedUserNickname },
                }"
              >
                enter
              </nuxt-link>
            </kbd>
            to load emote collection
          </span>
          <span v-else>
            Please, enter a string of 4-25 non-whitespace characters
          </span>
        </label>
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
const userNickname = ref("");

const trimmedUserNickname = computed(() =>
  userNickname.value.trim().replaceAll(" ", ""),
);

const isValidUserNickname = computed(
  () =>
    trimmedUserNickname.value.length >= 4 &&
    trimmedUserNickname.value.length <= 25,
);

function goToEmoteCollectionsPage() {
  return navigateTo({
    path: "/emote-collections",
    query: { nickname: trimmedUserNickname.value },
  });
}
</script>

<style></style>
