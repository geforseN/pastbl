<template>
  <div
    class="flex w-[420px] flex-wrap items-center rounded-b-btn border-2 px-2"
  >
    {{ $t(ce + "user.before") }}&nbsp;
    <div
      class="my-0.5 flex items-center space-x-2 divide-x divide-twitch rounded-btn border border-twitch p-0.5"
    >
      <div class="flex gap-1">
        <div class="flex h-6 w-6 items-center">
          <nuxt-link-locale
            :to="`/collections/users/${login}`"
            class="rounded-full border border-twitch focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch"
          >
            <img
              :src="avatarUrl"
              :alt="$t('avatar.alt', { nickname })"
              width="24"
              height="24"
              class="min-w-6 rounded-full bg-twitch/20"
            />
          </nuxt-link-locale>
        </div>
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
          class="menu dropdown-content z-[1] grid max-h-96 w-max overflow-y-auto rounded-btn border-2 bg-base-100 shadow"
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
              class="btn btn-outline btn-sm my-0.5 justify-start p-0 hover:bg-base-content"
              @click="
                () =>
                  userCollectionsStore.selectLogin(
                    collectionToSelect.user.twitch.login,
                  )
              "
            >
              <div class="flex items-center gap-1 rounded-btn p-0.5">
                <div class="flex h-6 w-6 items-center">
                  <nuxt-link-locale
                    :to="`/collections/users/${login}`"
                    class="rounded-full border border-twitch focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch"
                  >
                    <img
                      :src="collectionToSelect.user.twitch.avatarUrl"
                      :alt="$t('avatar.alt', { nickname })"
                      width="24"
                      height="24"
                      class="min-w-6 rounded-full bg-twitch/20"
                    />
                  </nuxt-link-locale>
                </div>
                <span class="line-clamp-1 break-all">
                  {{ collectionToSelect.user.twitch.nickname }}
                </span>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </div>
    &nbsp;{{ $t(ce + "user.after") }}
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

const avatarUrl = computed(() => props.collection.user.twitch.avatarUrl);

const userCollectionsStore = useUserCollectionsStore();
</script>
