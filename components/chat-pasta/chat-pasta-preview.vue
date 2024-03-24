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
            @mouseover="throttledMouseover"
          >
            {{ props.text }}
          </span>
        </span>
      </span>
      <button
        class="btn btn-accent btn-md text-lg"
        @click="() => userStore.copyText(props.text)"
      >
        {{ $t("pasta.create.preview.copyButton") }}
      </button>
    </div>
  </article>
</template>
<script lang="ts" setup>
import { getEmoteToken } from "~/integrations";

const pastaTextContainerRef = ref();

const userStore = useUserStore();
const emotesStore = useEmotesStore();

const props = defineProps<{
  text: string;
  canPopulate: () => MaybePromise<void>;
}>();

async function repopulateText() {
  await props.canPopulate();
  const validTokens = makeValidTokens(props.text);
  populatePasta(pastaTextContainerRef.value, { validTokens }, emotesStore);
}

watch(() => props.text, repopulateText);

const onHoverHint = inject<OnHoverHint>("onHoverHint") || raise();

const throttledMouseover = useThrottleFn(
  onHoverHint.makeMouseoverHandler({
    findEmote(target) {
      const token = getEmoteToken(target);
      return emotesStore.findEmote(token);
    },
    findEmoteModifiersByTokens(tokens) {
      assert.ok(tokens.length);
      const emotes = tokens
        .map(emotesStore.findEmote)
        .filter(
          (emote): emote is NonNullable<typeof emote> => emote !== undefined,
        );
      assert.ok(tokens.length === emotes.length);
      return emotes;
    },
  }),
  100,
  true,
);
</script>
