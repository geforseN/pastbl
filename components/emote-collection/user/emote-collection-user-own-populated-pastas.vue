<template>
  <div class="rounded-btn border-2 p-1">
    <h2 class="p-1 text-xl font-bold">
      {{ $t("pastas.withPersonEmotes", { login }) }}
    </h2>
    <div v-if="pastas.length" @mouseover="findEmoteInOpenedCollection">
      <chat-pasta-list
        v-if="canShowPastas"
        data-compact
        class="pasta-list h-[16dvh]"
        :items="pastas"
        :find-emote
        @remove-pasta="(pasta) => $emit('removePasta', pasta)"
      />
    </div>
    <chat-pasta-list-hint-on-empty v-else />
  </div>
</template>
<script setup lang="ts">
import { getEmoteToken } from "~/integrations";
import type { CanFindEmote } from "~/utils/pasta-dom";

const props = defineProps<
  CanFindEmote & {
    canShowPastas: boolean;
    login: TwitchUserLogin;
    pastas: OmegaPasta[];
  }
>();

defineEmits<{
  removePasta: [OmegaPasta];
}>();

const onHoverHint = inject<ExtendedOnHoverHint>("onHoverHint") || raise();

const findEmoteInOpenedCollection = useThrottleFn(
  onHoverHint.makeMouseoverHandler({
    findEmote(target) {
      const token = getEmoteToken(target);
      return props.findEmote(token);
    },
    findEmoteModifiersByTokens(tokens) {
      return tokens.map(props.findEmote).filter(isNotNullable);
    },
  }),
  100,
  true,
);
</script>
