<template>
  <div
    class="flex w-96 flex-col gap-2 rounded-box border-2 border-twitch-accent p-2"
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
        <div class="flex items-center justify-between gap-2">
          <user-collection-ready-time :date="new Date(collection.updatedAt)" />
          <button
            class="btn btn-success btn-sm border border-success-content"
            :disabled="asyncState.isLoading.value"
            @click="() => emit('refresh')"
          >
            {{ $t("collections.users.ready.button.refresh") }}
            <span
              v-if="asyncState.isLoading.value"
              class="loading loading-spinner"
            />
            <icon v-else name="ic:round-refresh" class="-ml-2" />
          </button>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between gap-1">
      <user-collection-ready-delete-button
        :nickname="twitch.nickname"
        @delete="() => emit('delete')"
      />
      <user-collection-ready-status
        :is-collection-selected="isCollectionSelected"
        :nickname="twitch.nickname"
        @select="() => emit('select')"
      />
    </div>
    <dev-only>
      <div class="form-control rounded-btn border border-accent p-2">
        <label for="find-user-emote" class="ml-1 cursor-pointer text-xl">
          Find emote
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
import type { InjectOnHoverHint } from "~/app.vue";
import { emotesIDB } from "~/client-only/services";

const { asyncState, isCollectionSelected } = defineProps<{
  asyncState: ReadyUserCollectionAsyncState;
  isCollectionSelected: boolean;
}>();
const emit = defineEmits<{
  refresh: [];
  delete: [];
  select: [];
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

async function getRefreshedIntegration(source: EmoteSource) {
  const record = await $fetch("/api/collections/users/integrations", {
    query: {
      sources: source,
      twitchUserId: twitch.value.id,
      twitchUserNickname: twitch.value.nickname,
    },
  });
  const newIntegration = record[source];
  assert.ok(newIntegration);
  return newIntegration;
}

const { makeMouseoverHandler } =
  inject<InjectOnHoverHint>("hoveredEmote") || raise();
const emoteSource = ref<EmoteSource>();

const throttledMouseover = useThrottleFn(
  makeMouseoverHandler({
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
