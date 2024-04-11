<template>
  <article class="flex flex-col rounded-box border p-3">
    <h3 class="mb-1 ml-1 text-2xl font-bold">
      {{ $t("pasta.create.preview.heading") }}
    </h3>
    <span class="w-[340px] grow border border-secondary">
      <span class="block w-full px-[10px] py-[5px]">
        <chat-pasta-creator-data
          :badges-count="userStore.user.badges.count.state"
          :nickname="userStore.user.nickname.text.state"
          :nickname-color="userStore.user.nickname.color.state"
        />
        <span aria-hidden="true">{{ ": " }}</span>
        <span
          ref="pastaTextContainerRef"
          class="twitch-text p-0 text-[13px]/[18px]"
          @mouseover="throttledMouseover"
        >
          {{ props.text }}
        </span>
      </span>
    </span>
    <button
      class="btn btn-accent btn-md -ml-px w-[342px] rounded-t-none text-lg"
      @click="() => userStore.copyText(props.text)"
    >
      {{ $t("pasta.create.preview.copyButton") }}
    </button>
  </article>
</template>
<script lang="ts" setup>
const pastaTextContainerRef = ref();

const userStore = useUserStore();
const emotesStore = useEmotesStore();

const props = defineProps<{
  text: string;
  canPopulate: () => MaybePromise<void>;
}>();

async function repopulateText() {
  await props.canPopulate();
  const validTokens = makeValidTokensFromPastaText(props.text);
  populatePasta(
    pastaTextContainerRef.value,
    validTokens,
    emotesStore.findEmote,
  );
}

watch(() => props.text, repopulateText);

const onHoverHint = inject<ExtendedOnHoverHint>("onHoverHint") || raise();

const throttledMouseover = useThrottleFn(
  onHoverHint.allEmotesHandler,
  100,
  true,
);
</script>
