<template>
  <article class="mt-2 rounded-box border p-4">
    <h3 class="text-xl font-bold">
      {{ $t("pasta.create.preview.heading") }}
    </h3>
    <div class="flex w-[340px] flex-col">
      <span class="block grow border border-secondary">
        <span class="block w-full px-[10px] py-[5px]">
          <chat-pasta-creator-data
            :badges-count="userStore.user.badges.count.state"
            :nickname="userStore.user.nickname.text.state"
            :nickname-color="userStore.user.nickname.color.state"
          />
          <span aria-hidden="true">:&nbsp;</span>
          <span
            ref="pastaTextContainerRef"
            class="twitch-text p-0 text-[13px]/[18px]"
          >
            {{ pastaStore.pastaTrimmedText }}
          </span>
        </span>
      </span>
      <button
        class="btn btn-accent btn-md text-lg"
        @click="() => userStore.copyText(pastaStore.pastaTrimmedText)"
      >
        {{ $t("pasta.create.preview.copyButton") }}
      </button>
    </div>
  </article>
</template>
<script lang="ts" setup>
const pastaTextContainerRef = ref();

const userStore = useUserStore();
const pastaStore = usePastaStore();
const emotesStore = useEmotesStore();

async function repopulateText() {
  await Promise.all([
    until(() => pastaStore.text.isRestored).toBeTruthy({ timeout: 3_000 }),
    until(() => emotesStore.isInitialUserEmotesReady).toBeTruthy(),
  ]);
  const validTokens = makeValidTokens(pastaStore.pastaTrimmedText);
  populatePasta(pastaTextContainerRef.value, { validTokens }, emotesStore);
}

watch(() => pastaStore.pastaTrimmedText, repopulateText);
</script>
