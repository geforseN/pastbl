<template>
  <div class="flex w-96 flex-col gap-2">
    <div class="rounded-box border-2 p-2">
      <section class="p-2">
        <label for="active-user-collection">
          <h2 class="text-2xl font-bold">Select active user collection</h2>
        </label>
        <select
          id="active-user-collection"
          ref="userEmoteCollectionSelectRef"
          name="active-user-collection"
          class="select select-secondary mt-1 w-full"
          :disabled="userCollectionsStore.selectedCollectionUsername.isLoading"
          @input="handleSelectInput"
        >
          <option value="" />
          <option
            v-for="name of userCollectionsStore.usernamesToSelect.state"
            :key="name"
            :value="name"
            :selected="
              name === userCollectionsStore.selectedCollectionUsername.state
            "
          >
            {{ name }}
          </option>
        </select>
      </section>
    </div>
    <selected-user-collection
      :collection="userCollectionsStore.selectedCollection"
      :is-collection-selected="true"
      @update="
        () => {
          /* TODO */
        }
      "
    />
    <div class="rounded-box border-2 px-4 py-2">
      <nuxt-link to="/emotes">
        <span
          class="flex items-center justify-between gap-2 text-3xl font-bold"
        >
          <span class="flex items-center gap-2">
            <icon name="carbon:link" />
            Look for emotes
          </span>
          <div class="flex items-center gap-1">
            <span class="mr-4 flex flex-col gap-1">
              <icon-emote-integration-logo
                v-for="source of availableEmoteSources"
                v-once
                :key="source"
                :class="
                  source === 'BetterTTV' &&
                  'absolute translate-x-4 translate-y-2'
                "
                :source="source"
                width="16"
                heigth="16"
                class="max-h-[16px] text-xs"
              />
            </span>
          </div>
        </span>
      </nuxt-link>
    </div>
    <go-to-main-page />
  </div>
</template>
<script lang="ts" setup>
import { availableEmoteSources } from "~/integrations";

const userCollectionsStore = useUserCollectionsStore();

const userEmoteCollectionSelectRef = ref<HTMLSelectElement>();

async function handleSelectInput(event: Event) {
  await userCollectionsStore.selectedCollectionUsername.execute(
    0,
    (event.currentTarget as HTMLSelectElement).value,
  );
  userEmoteCollectionSelectRef.value?.focus();
}
</script>
