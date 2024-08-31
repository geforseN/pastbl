<template>
  <!-- NOTE: w-[25rem] is required, otherwise pastas related components will have x-scroll  -->
  <div
    class="w-[25rem] space-y-2 rounded-box border-2 border-twitch-accent p-2"
    :class="
      isRefreshing &&
      'animate-pulse bg-gradient-to-t from-base-300 to-twitch-accent/50'
    "
  >
    <div v-if="person?.twitch" class="flex gap-2">
      <twitch-user-avatar :twitch="person.twitch" :size="64" />
      <div class="flex w-72 flex-col justify-between">
        <person-emotes-collection-title
          :twitch="person.twitch"
          class="w-min max-w-72 truncate"
        />
        <emote-collection-formed-at v-if="formedAt" :time="formedAt" />
      </div>
    </div>
    <div v-else class="flex gap-2">
      <div class="skeleton size-16 rounded-full" />
      <div class="flex w-72 flex-col justify-between">
        <div class="skeleton h-8 w-full rounded-none" />
        <div class="skeleton h-5 w-1/3 rounded-none" />
      </div>
    </div>
    <person-emotes-collection-actions
      :is-collection-selected="isSelected"
      :is-collection-refreshing="isRefreshing"
      @select="collection.select"
      @unselect="collection.unselect"
      @delete="collection.delete().then(() => $emit('deleted'))"
      @refresh="collection.refresh"
    />
    <dev-only>
      <emote-integrations-emotes-search />
    </dev-only>
    <div v-if="person?.twitch" @mouseover="throttledMouseover">
      <person-emotes-collection-integration
        v-for="integration of readyIntegrations"
        :key="integration.source"
        :integration
        :twitch="person.twitch"
        @refresh="async () => await collection.refreshIntegration(integration)"
      />
    </div>
    <div
      v-if="collection.state.value"
      class="space-y-2 bg-base-200"
      @mouseover="throttledMouseover"
    >
      <person-emotes-collection-tagged-pastas
        :login
        :pastas="userTaggedPastas"
        :can-show-pastas="pastasStore.canShowPastas"
        @remove-pasta="removePasta"
      />
      <person-emotes-collection-own-populated-pastas
        :login
        :pastas="pastasStore.pastasToShow"
        :can-show-pastas="pastasStore.canShowPastas"
        :find-emote="collection.findEmote"
        @remove-pasta="removePasta"
      />
    </div>
    <div v-if="isLoading">Loading...</div>
    <div v-if="error">
      <template v-if="isError(error)">
        {{ error.message }}
      </template>
      <template v-else>
        {{ $t("userCollection.failedToLoad", { login }) }}
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
const { login } = defineProps<{
  login: TwitchUserLogin;
}>();

defineEmits<{
  deleted: [];
}>();

const {
  error,
  formedAt,
  isInitializing,
  isLoading,
  isReady,
  isRefreshing,
  isSelected,
  readyIntegrations,
  person,
  ...collection
} = usePersonCollection(login);

const pastasStore = usePastasStore();
const userTaggedPastas = computed(() => pastasStore.usersPastasMap.get(login));

async function removePasta(pasta: OmegaPasta) {
  return await pastasStore.removePasta(pasta);
}

const emoteOnHover = injectEmoteOnHover();

const throttledMouseover = useThrottleFn(
  emoteOnHover.makeMouseoverHandler({
    async findEmote(target) {
      const { integrationSource } = EmoteIntegrationContainer.fromClosestOf(target);
      const { emoteId } = EmoteContainer.from(target);
      const emote = await emotesService.__getEmote__(integrationSource, emoteId);
      return emote;
    },
  }),
  100,
  true,
);
</script>
