<template>
  <!-- FIXME: remove 'absolute' & 'relative', use grid -->
  <div
    class="w-96 space-y-2 rounded-box border-2 border-twitch-accent p-2"
    :class="
      isRefreshing &&
      'animate-pulse bg-gradient-to-t from-base-300 to-twitch-accent/50'
    "
    @mouseover="throttledMouseover"
  >
    <div v-if="user?.twitch" class="flex gap-2">
      <twitch-user-avatar :user="user.twitch" :size="64" />
      <div class="flex w-72 flex-col justify-between">
        <emote-collection-user-title
          :user="user.twitch"
          class="w-min max-w-72 truncate"
        />
        <emote-collection-formed-at :time="formedAt" />
      </div>
    </div>
    <emote-collection-user-actions
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
    <!-- SLOT for integrations -->
    <template
      v-for="integration of readyIntegrations"
      :key="integration.source"
    >
      <!-- FIXME: no is-refreshing prop, must add ? -->
      <!-- FIXME: no is-refreshing prop, must add ? -->
      <!-- FIXME: no is-refreshing prop, must add ? -->
      <emote-collection-user-integration
        v-if="integration"
        status="ready"
        :collection="integration"
        :source="integration.source"
        :data-integration-source="integration.source"
        @refresh="async () => await collection.refreshIntegration(integration)"
      />
    </template>
    <div v-if="collection.state.value" class="space-y-2 bg-base-200">
      <emote-collection-user-tagged-pastas
        :login
        :pastas="userTaggedPastas"
        :can-show-pastas="pastasStore.canShowPastas"
        @remove-pasta="removePasta"
      />
      <emote-collection-user-own-populated-pastas
        v-if="!isSelected"
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
import { getEmoteId, isEmoteSource } from "~/integrations";
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

async function removePasta(pasta: IDBMegaPasta) {
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
