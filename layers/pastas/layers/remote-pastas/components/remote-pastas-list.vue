<template>
  <div
    ref="remotePastasList"
    :class="appConfig.pastaList.heights"
    class="chat-pasta-list overflow-y-auto"
  >
    <chat-pasta
      v-for="pasta of pastasStore.__remotePastas"
      :key="`${pasta.id}:${pasta.text}`"
      :text="pasta.text"
      :tags="pasta.tags"
      :time="{
        label: 'Published',
        value: pasta.publishedAt,
      }"
      compact
      @remove="deletePasta(pasta.id)"
      @copy="userStore.copyText(pasta.text)"
      @edit="navigateTo($localePath(`/pastas/remote/edit/${pasta.id}`))"
      @populate="
        (pastaTextContainer) => {
          populatePasta(
            pastaTextContainer,
            makeValidPastaTokens(pasta.text),
            emotesStore.findEmote,
          );
        }
      "
    >
      <template #creatorData>
        <chat-pasta-creator-data
          :badges-count="userStore.user.badges.count.state"
          :nickname="userStore.user.nickname_"
          :nickname-color="userStore.user.debounced.nickname.color"
        />
      </template>
    </chat-pasta>
  </div>
</template>
<script setup lang="ts">
import { z } from "zod";
import { withRemoved } from "../../../../../app/utils/array";
import { useActionToasts } from "../../../../toast/composables/useActionToasts";
import { pastasAPI } from "../utils/pastas.api";
import { useRemotePastasInfiniteLoad } from "../composables/useRemotePastasInfiniteLoad";
import { usePastasStore } from "../../../../../app/stores/usePastasStore";
import { useEmotesStore } from "../../../../../app/stores/useEmotesStore";
import { useUserStore } from "../../../../../app/stores/useUserStore";
import { useAppConfig } from "#app/config";
import { assertIsRemotePastasPaginationCursor } from "~/brands";

const appConfig = useAppConfig();

const userStore = useUserStore();
const emotesStore = useEmotesStore();
const pastasStore = usePastasStore();

const remotePastasListRef = useTemplateRef("remotePastasList");
useRemotePastasInfiniteLoad<number>(
  remotePastasListRef,
  async function onLoadMore(cursor) {
    cursor ??= null;
    assertIsRemotePastasPaginationCursor(cursor);
    const response = await pastasAPI.getPastas(cursor)
      .then(getPastasResponseSchema.parse);
    pastasStore.__remotePastas.push(...response.pastas);
    return {
      cursor: response.cursor,
    };
  },
);

const toast = useActionToasts();

const getPastasResponseSchema = z.object({
  pastas: z
    .array(
    /* REPEATED LIKE */z.object({
        id: z.number().positive(),
        lastUpdatedAt: z.string().nullable(),
        publicity: /* REPEATED */z.enum(["public", "private"]),
        publishedAt: z.string(),
        tags: z.array(
          z.object({
            value: z.string(),
          }),
        ),
        text: z.string(),
      }),
    )
    .transform((pastas) =>
      pastas.map((pasta) => ({
        id: pasta.id,
        text: pasta.text,
        publishedAt: pasta.publishedAt,
        tags: pasta.tags.map((tag) => tag.value),
      })),
    ),
  cursor: z.number().positive().nullable(),
});

// TEST: can delete remove pasta with tags

async function deletePasta(pastaId: number) {
  try {
    await pastasAPI.deletePasta(pastaId);
    pastasStore.__remotePastas = withRemoved(pastasStore.__remotePastas, (pasta) => pasta.id === pastaId);
    toast.add(() => ({
      title: "Remote pasta delete",
      description: "Successfully deleted remote pasta",
      type: "success",
    }));
  } catch {
    toast.add(() => ({
      title: "Remote pasta delete",
      description: "Failed to delete remote pasta",
      type: "error",
    }));
  }
}
</script>
