<template>
  <!-- NOTE: w-[25rem] is required, otherwise pastas related components will have x-scroll  -->
  <div
    class="w-[25rem] space-y-2 rounded-box border-2 border-twitch-accent p-2"
    :class="
      isRefreshing &&
      'animate-pulse bg-gradient-to-t from-base-300 to-twitch-accent/50'
    "
  >
    <div v-if="user?.twitch" class="flex gap-2">
      <twitch-user-avatar :user="user.twitch" :size="64" />
      <div class="flex w-72 flex-col justify-between">
        <emote-collection-person-title
          :user="user.twitch"
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
    <emote-collection-person-actions
      :is-collection-selected="isSelected"
      :is-collection-refreshing="isRefreshing"
      @select="collection.select"
      @unselect="collection.unselect"
      @delete="collection.delete().then(() => emit('deleted'))"
      @refresh="collection.refresh"
    />
    <dev-only>
      <emote-collection-search-emote />
    </dev-only>
    <div v-if="user?.twitch" @mouseover="throttledMouseover">
      <emote-collection-person-integration
        v-for="integration of readyIntegrations"
        :key="integration.source"
        :integration
        :user="user.twitch"
        @refresh="async () => await collection.refreshIntegration(integration)"
      />
    </div>
    <div
      v-if="collection.state.value"
      class="space-y-2 bg-base-200"
      @mouseover="throttledMouseover"
    >
      <emote-collection-person-tagged-pastas
        :login
        :pastas="userTaggedPastas"
        :can-show-pastas="pastasStore.canShowPastas"
        @remove-pasta="removePasta"
      />
      <emote-collection-person-own-populated-pastas
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
import { getEmoteId } from "~/integrations/dom";
import { isEmoteSource } from "~/integrations/emote-source";
import { emotesIDB } from "~/client-only/services";

const { login } = defineProps<{
  login: TwitchUserLogin;
}>();

const emit = defineEmits<{
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
  user,
  ...collection
} = useUserCollection(login);

const pastasStore = usePastasStore();
const userTaggedPastas = computed(() => pastasStore.usersPastasMap.get(login));

async function removePasta(pasta: OmegaPasta) {
  return await pastasStore.removePasta(pasta);
}

const onHoverHint = inject<ExtendedOnHoverHint>("onHoverHint") || raise();

const throttledMouseover = useThrottleFn(
  onHoverHint.makeMouseoverHandler({
    async findEmote(target) {
      const integrationContainer = target.closest("[data-integration-source]");
      assert.ok(integrationContainer instanceof HTMLElement);
      const source = integrationContainer.dataset.integrationSource;
      assert.ok(source && isEmoteSource(source));
      const emoteId = getEmoteId(target);
      const emote = await emotesIDB.getEmote(source, emoteId);
      return emote;
    },
  }),
  100,
  true,
);
</script>
