<template>
  <div class="rounded-btn border-2 p-1">
    <h2 class="p-1 text-xl font-bold">
      {{ $t("pastas.withPersonEmotes", { login }) }}
    </h2>
    <div
      v-if="pastas.length > 0"
      @mouseover="findEmoteInOpenedCollection"
    >
      <local-pastas-list
        v-if="canShowPastas"
        compact
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
type Props = {
  findEmote: (token: string) => IEmote | undefined;
  canShowPastas: boolean;
  login: TwitchUserLogin;
  pastas: OmegaPasta[];
};

const props = defineProps<Props>();

defineEmits<{
  removePasta: [OmegaPasta];
}>();

const emoteOnHover = injectEmoteOnHover();

const findEmoteInOpenedCollection = useThrottleFn(
  emoteOnHover.makeMouseoverHandler({
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
