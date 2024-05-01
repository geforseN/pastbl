<template>
  <div class="flex flex-wrap items-center px-2">
    {{ $t(ce + "user.before") }}&nbsp;
    <div
      class="my-0.5 flex items-center space-x-2 divide-x divide-twitch-accent rounded-btn border border-twitch-accent p-0.5"
    >
      <div class="flex gap-1">
        <twitch-user-avatar :user="props.collection.user.twitch" :size="24" />
        <nuxt-link-locale
          :to="`/collections/users/${login}`"
          class="link line-clamp-1 break-all font-bold"
        >
          {{ nickname }}
        </nuxt-link-locale>
      </div>
      <div class="dropdown dropdown-end go-brr:dropdown-right">
        <div tabindex="0" role="button" class="flex items-center">
          <icon name="ic:arrow-drop-down" class="min-w-6" size="24" />
        </div>
        <ul
          tabindex="0"
          class="menu dropdown-content z-10 grid max-h-96 w-max overflow-y-auto rounded-btn border-2 bg-base-100 shadow"
        >
          <li>
            <nuxt-link-locale
              :to="{
                path: '/collections',
                query: {
                  'focus-fetch-input': 'true',
                },
                hash: '#heading',
              }"
              class="btn btn-accent btn-sm items-center justify-start gap-1.5 text-nowrap p-2"
            >
              <icon name="carbon:link" size="16" />
              <span class="link">
                {{ $t("app.hint.add-emotes.user.before") }}
                {{ $t("app.hint.add-emotes.user.link") }}
              </span>
            </nuxt-link-locale>
          </li>
          <li
            v-for="collectionToSelect of userCollectionsStore
              .collectionsToSelect.state"
            :key="collectionToSelect.user.twitch.login"
            class="odd:bg-base-300"
          >
            <button
              class="btn btn-outline btn-sm my-0.5 justify-start p-0 hover:border-secondary"
              @click="
                () => userCollectionsStore.selectCollection(collectionToSelect)
              "
            >
              <div class="flex items-center gap-1 rounded-btn p-0.5">
                <twitch-user-avatar
                  :user="collectionToSelect.user.twitch"
                  :size="24"
                />
                <span class="line-clamp-1 break-all">
                  {{ collectionToSelect.user.twitch.nickname }}
                </span>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <span v-if="$t(ce + 'user.after')">
      &nbsp;{{ $t(ce + "user.after") }}
    </span>
  </div>
</template>
<script setup lang="ts">
import type { IUserEmoteCollection } from "~/integrations";

const ce = "app.hint.current-emotes." as const;

const props = defineProps<{
  collection: IUserEmoteCollection;
}>();
const nickname = computed(() => props.collection.user.twitch.nickname);
const login = computed(() => props.collection.user.twitch.login);

const userCollectionsStore = useUserCollectionsStore();
</script>
