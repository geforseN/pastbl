<template>
  <article class="flex flex-col rounded-box border p-3">
    <h3 class="mb-1 ml-1 text-2xl font-bold">
      {{ $t("pasta.preview") }}
    </h3>
    <span class="w-[342px] grow border border-secondary">
      <span class="block w-full px-[10px] py-[5px]">
        <chat-pasta-creator-data
          :badges-count="userStore.user.badges.count.state"
          :nickname="userStore.user.nickname_"
          :nickname-color="userStore.user.nickname.color.state"
        />
        <span aria-hidden="true">{{ ": " }}</span>
        <span
          ref="pastaTextContainerRef"
          class="twitch-text p-0 text-[13px]/[18px]"
          @mouseover="throttledMouseover"
        >
          {{ text }}
        </span>
      </span>
    </span>
    <button
      class="btn btn-accent btn-md -ml-px w-[342px] rounded-t-none text-lg"
      @click="userStore.copyText(text)"
    >
      {{ $t("text.copy") }}
    </button>
  </article>
</template>
<script setup>
const pastaTextContainerRef = ref();

const userStore = useUserStore();
const emotesStore = useEmotesStore();

const props = defineProps<{
  text: string;
  canPopulate: () => MaybePromise<boolean>;
}>();

async function repopulateText() {
  const canContinue = await props.canPopulate();
  if (!canContinue) {
    return;
  }
  const validTokens = makeValidPastaTokens(props.text);
  populatePasta(
    pastaTextContainerRef.value,
    validTokens,
    emotesStore.findEmote,
  );
}

watch(() => props.text, repopulateText);

const emoteOnHover = injectEmoteOnHover();

const throttledMouseover = useThrottleFn(
  emoteOnHover.allEmotesHandler,
  100,
  true,
);
</script>
