<template>
  <div class="flex flex-col gap-2">
    <pasta-form-edit
      ref="pastaFormEditRef"
      v-model:tag="tag"
      v-model:text="megaPasta.text"
      v-model:tags="megaPasta.tags"
      @accept="
        async () => {
          await pastasStore.putPasta({
            id: megaPasta.id,
            createdAt: megaPasta.createdAt,
            lastCopiedAt: megaPasta.lastCopiedAt,
            text: trimmedText,
            length: trimmedText.length,
            tags: toRaw(megaPasta.tags),
            validTokens: makeValidTokens(trimmedText),
            updatedAt: Date.now(),
          });
        }
      "
      @decline="navigateTo('/')"
    />
    <client-only>
      <chat-pasta
        :key="trimmedText"
        class="self-center"
        :pasta="megaPasta"
        @populate="
          async (pastaTextContainer) => {
            // NOTE: without validTokens assignment only emotes that are in old validTokens will be populated
            // (populatePasta is reliable on validTokens, validTokens must be updated on text change)
            megaPasta.validTokens = makeValidTokens(trimmedText);
            populatePasta(pastaTextContainer, megaPasta, emotesStore);
          }
        "
      >
        <template #creatorData>
          <chat-pasta-creator-data
            :badges-count="userStore.user.badges.count.state"
            :nickname="userStore.user.nickname.text.state"
            :nickname-color="userStore.user.debounced.nickname.color"
          />
        </template>
        <template #sidebar>
          <button
            class="btn btn-square btn-accent btn-md border-2 border-accent-content text-xs"
            :disabled="!userStore.clipboard.isSupported"
            @click="() => userStore.copyPasta(megaPasta)"
          >
            Copy pasta
          </button>
        </template>
      </chat-pasta>
    </client-only>
    <app-page-link to="find-pasta">
      <template #right>🔍</template>
    </app-page-link>
    <app-page-link to="user-settings">
      <template #right>⚙️</template>
    </app-page-link>
    <app-page-link to="emotes">
      <template #right><emote-integration-logos /></template>
    </app-page-link>
    <app-page-link to="main" />
  </div>
</template>
<script setup lang="ts">
import type { PastaFormEdit } from "#build/components";

const route = useRoute();
assert.ok(typeof route.params.pastaId === "string");
const pastaId = Number(route.params.pastaId);

const pastaFormEditRef = ref<InstanceType<typeof PastaFormEdit>>();

const userStore = useUserStore();
const emotesStore = useEmotesStore();
const pastasStore = usePastasStore();

const megaPasta = ref<IDBMegaPasta>({
  ...createMegaPasta("", []),
  id: -1,
});
const tag = ref("");

const trimmedText = computed(() => trimPastaText(megaPasta.value.text));

onMounted(async () => {
  await Promise.all([
    until(() => pastasStore.pastas.isReady).toBeTruthy({ timeout: 3_000 }),
    until(() => emotesStore.isInitialUserEmotesReady).toBeTruthy({
      timeout: 3_000,
    }),
  ]).then(() => nextTick());
  pastaFormEditRef.value?.pastaFormTextareaRef.textareaRef.focus();
  const pasta = pastasStore.getPastaById(pastaId);
  megaPasta.value = structuredClone(pasta);
});
</script>
