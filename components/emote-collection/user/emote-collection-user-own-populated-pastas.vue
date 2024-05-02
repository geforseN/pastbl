<template>
  <div class="rounded-btn border-2 p-1">
    <h2 class="p-1 text-xl font-bold">
      {{ $t("pastas.withUserEmotes", { login }) }}
    </h2>
    <div v-if="pastas.length" @mouseover="findEmoteInOpenedCollection">
      <chat-pasta-list
        v-if="canShowPastas"
        class="pasta-list max-h-[46dvh]"
        :items="pastas"
        :find-emote
        @remove-pasta="removePasta"
      />
    </div>
    <chat-pasta-list-hint-on-empty v-else />
  </div>
</template>
<script setup lang="ts">
import { getEmoteToken, type IEmote } from "~/integrations";

const { canShowPastas, findEmote, login, pastas, removePasta } = defineProps<{
  canShowPastas: boolean;
  findEmote(token: string): IEmote | undefined;
  login: TwitchUserLogin;
  pastas: IDBMegaPasta[];
  removePasta(pasta: IDBMegaPasta): void;
}>();

const onHoverHint = inject<ExtendedOnHoverHint>("onHoverHint") || raise();

const findEmoteInOpenedCollection = useThrottleFn(
  onHoverHint.makeMouseoverHandler({
    findEmote(target) {
      const token = getEmoteToken(target);
      return findEmote(token);
    },
    findEmoteModifiersByTokens(tokens) {
      return tokens.map(findEmote).filter(isNotNullable);
    },
  }),
  100,
  true,
);
</script>
