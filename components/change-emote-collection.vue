<template>
  <section class="border-2 border-base-content p-2">
    <h2 class="p-2 text-3xl font-bold">Change emote collection</h2>
    <client-only>
      <div class="flex flex-col gap-2">
        <div
          v-if="collectionsStore.usersCollectionsEntries.length"
          class="border"
        >
          <emote-collection-user-table
            :entries="collectionsStore.usersCollectionsEntries"
          />
        </div>
        <div
          v-if="collectionsStore.globalCollectionsEntries.length"
          class="border"
        >
          <emote-collection-global-table
            :entries="collectionsStore.globalCollectionsEntries"
            @show-details="
              (sourceToShow) => {
                collectionToShow =
                  collectionsStore.globalCollectionsEntries.find(
                    ([source]) => source === sourceToShow,
                  )?.[1] || null;
                if (collectionToShow && modalRef) {
                  modalRef.showModal();
                }
              }
            "
          />
        </div>
      </div>
    </client-only>
    <Teleport to="body">
      <dialog ref="modalRef" class="modal">
        <div class="modal-box">
          <emote-collection-bttv-sync
            v-if="collectionToShow?.source === 'BetterTTV'"
            :sets="collectionToShow.sets"
          />
          <emote-collection-ffz-sync
            v-else-if="collectionToShow?.source === 'FrankerFaceZ'"
            :sets="collectionToShow.sets"
          />
          <emote-collection-seventv-sync
            v-else-if="collectionToShow?.source === 'SevenTV'"
            :sets="collectionToShow.sets"
          />
          <div class="modal-action">
            <form method="dialog" @submit="collectionToShow = null">
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
        <form
          method="dialog"
          class="modal-backdrop bg-black/30"
          @submit="collectionToShow = null"
        >
          <button>Close</button>
        </form>
      </dialog>
    </Teleport>
  </section>
</template>

<script lang="ts" setup>
import type { IGlobalEmoteCollection } from "~/integrations";

const collectionsStore = useCollectionsStore();
const collectionToShow = ref<IGlobalEmoteCollection | null>(null);
const modalRef = ref<HTMLDialogElement | null>(null);
</script>
