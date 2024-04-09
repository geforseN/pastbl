<template>
  <div
    class="flex w-96 flex-col gap-2 rounded-box border-2 border-twitch-accent p-2"
    :class="
      asyncState.isLoading.value &&
      'animate-pulse bg-gradient-to-t from-base-300 to-twitch-accent/50'
    "
    @mouseover="throttledMouseover"
  >
    <div class="flex gap-2">
      <div class="flex h-16 min-w-16 items-center">
        <nuxt-link-locale
          :to="`https://twitch.tv/${twitch.login}`"
          class="rounded-full border border-twitch-accent focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch-accent"
        >
          <img
            class="rounded-full bg-twitch-accent/20"
            width="64"
            height="64"
            :src="twitch.avatarUrl"
            :alt="$t('avatar.alt', { nickname: twitch.nickname })"
          />
        </nuxt-link-locale>
      </div>
      <div class="flex w-72 flex-col justify-between">
        <nuxt-link-locale
          class="w-min max-w-72 truncate rounded-lg focus:no-underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch-accent"
          :to="`https://twitch.tv/${twitch.login}`"
          :title="twitch.nickname"
        >
          <span
            class="link inline-block text-2xl font-bold decoration-twitch-accent underline-offset-4"
          >
            {{ twitch.nickname }}
          </span>
        </nuxt-link-locale>
        <div class="relative flex items-center justify-between gap-2">
          <emote-collection-formed-at :time="collection.formedAt" />
          <!-- FIXME: remove 'absolute' & 'relative', use grid -->
          <emote-collection-user-select-status
            size="sm"
            selected-class="rounded-badge gap-0 pt-1"
            class="absolute bottom-0 right-0 h-fit w-min text-wrap"
            :is-selected="isCollectionSelected"
            :nickname="twitch.nickname"
            @select="emit('select')"
          />
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between gap-1">
      <emote-collection-user-delete-button-dialog
        v-slot="{ revealDialog, isDialogRevealed }"
        class="left-0 top-8"
        @delete="emit('delete')"
      >
        <emote-collection-user-delete-button
          size="sm"
          :disabled="isDialogRevealed"
          class="gap-0.5 border border-error-content"
          @click="revealDialog"
        />
      </emote-collection-user-delete-button-dialog>
      <button
        v-if="isCollectionSelected"
        class="btn btn-error btn-sm shrink"
        @click="emit('unselect')"
      >
        {{ $t("userCollection.makeInactive") }}
      </button>
      <emote-collection-refresh-button
        size="sm"
        class="gap-0.5"
        :is-refreshing="asyncState.isLoading.value"
        @click="emit('refresh')"
      />
    </div>
    <dev-only>
      <div class="form-control rounded-btn border border-accent p-2">
        <label for="find-user-emote" class="ml-1 cursor-pointer text-xl">
          {{ $t("emote.find") }}
        </label>
        <input
          id="find-user-emote"
          type="search"
          name="find-user-emote"
          class="input input-sm input-accent"
        />
      </div>
    </dev-only>
    <template
      v-for="integration of readyIntegrations"
      :key="integration.source"
    >
      <emote-collection-user-integration
        v-if="integration"
        status="ready"
        :collection="integration"
        :source="integration.source"
        @mouseover="
          () => {
            emoteSource = integration.source;
          }
        "
        @refresh="
          async () => {
            const newIntegration = await getRefreshedIntegration(
              integration.source,
            );
            assert.ok(newIntegration.status === 'ready');
            emit('refreshIntegration', newIntegration);
          }
        "
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import {
  getEmoteId,
  type EmoteSource,
  type IUserEmoteIntegration,
  type IUserEmoteIntegrationRecord,
} from "~/integrations";
import type { ReadyUserCollectionAsyncState } from "~/pages/collections/users/[nickname].vue";
import { emotesIDB } from "~/client-only/services";
import { USERS_COLLECTIONS_API } from "~/client-only/services/userCollections";

const { asyncState, isCollectionSelected } = defineProps<{
  asyncState: ReadyUserCollectionAsyncState;
  isCollectionSelected: boolean;
}>();
const emit = defineEmits<{
  refresh: [];
  delete: [];
  select: [];
  unselect: [];
  refreshIntegration: [newIntegration: IUserEmoteIntegration];
}>();

const collection = computed(() => asyncState.state.value);
const twitch = computed(() => collection.value.user.twitch);

const readyIntegrations = computed(() => {
  const values = Object.values(collection.value.integrations);
  return flatGroupBy(
    values,
    (integration) => integration.source,
  ) as IUserEmoteIntegrationRecord;
});

async function getRefreshedIntegration<S extends EmoteSource>(source: S) {
  return await USERS_COLLECTIONS_API.integrations.refresh(
    source,
    twitch.value.login,
  );
}

const onHoverHint = inject<ExtendedOnHoverHint>("onHoverHint") || raise();
const emoteSource = ref<EmoteSource>();

const throttledMouseover = useThrottleFn(
  onHoverHint.makeMouseoverHandler({
    async findEmote(target) {
      assert.ok(emoteSource.value);
      const emoteId = getEmoteId(target);
      const getEmoteBySource = await emotesIDB.makeEmoteGetter(
        emoteSource.value,
      );
      const emote = await getEmoteBySource(emoteId);
      return emote;
    },
  }),
  100,
  true,
);
</script>
