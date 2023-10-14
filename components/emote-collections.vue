<template>
  <section class="divide-y-2 rounded border-2 border-base-content p-2">
    <h2 class="p-2 text-3xl font-bold">Emote collection</h2>
    <div class="grid w-full grid-cols-1 p-2">
      <label class="label" for="user-emote-collections">
        <span class="text-xl font-medium">Load twitch user</span>
      </label>
      <div class="join">
        <input
          class="input join-item input-primary w-full"
          id="user-emote-collections"
          v-model="userTwitchNickname"
          type="text"
          placeholder="Enter twitch nickname"
        />
        <button
          class="btn btn-primary join-item w-40 max-w-[40%]"
          @click="doMoreMagic.execute()"
          :disabled="doMoreMagic.isLoading.value"
        >
          {{ doMoreMagic.isLoading.value ? "loading" : "load" }}
        </button>
      </div>
    </div>
    <button class="btn btn-primary" v-show="showButton">TODO</button>
    <div class="flex flex-col">
      <div class="bg-primary" v-if="ffz.state.value">
        <img
          width="32"
          height="32"
          :src="ffz.state.value.user.avatar"
          :alt="ffz.state.value.user.display_name + ' avatar'"
        />
      </div>

      <emote-collection-ffz :ffz="ffz" :ffzRoom="ffzRoom" />
      <emote-collection-betterttv :bttv="bttv" />
      <emote-collection-seventv :seventv="seventv" />
    </div>
  </section>
</template>

<script lang="ts" setup>
const userTwitchNickname = ref("");

watchDebounced(
  userTwitchNickname,
  (userTwitchNickname) => {
    if (!userTwitchNickname.length) {
      return;
    }
    if (doMoreMagic.isLoading.value) {
      return;
    }
    doMoreMagic.execute();
  },
  { debounce: 1_500 },
);

const showButton = ref(false);

const { ffz, ffzRoom, bttv, seventv, doMagic } =
  useAsyncEmoteSets(userTwitchNickname);

const doMoreMagic = useAsyncState(
  async () => {
    await doMagic();
    showButton.value = true;
  },
  null,
  { immediate: false },
);

export type SevenTVReturn = typeof seventv;
export type FFZReturn = typeof ffz;
export type FFZRoomReturn = typeof ffzRoom;
export type BTTVReturn = typeof bttv;
</script>
