<template>
  <div class="flex w-96 flex-col gap-2 rounded-box border-2 border-twitch p-2">
    <div class="flex gap-2">
      <div class="flex h-16 min-w-16 items-center">
        <nuxt-link
          :to="`https://twitch.tv/${twitch.login}`"
          class="rounded-full border border-twitch focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch"
        >
          <img
            class="rounded-full bg-twitch/20"
            width="64"
            height="64"
            :src="twitch.avatarUrl"
            :alt="twitch.nickname + ' avatar'"
          />
        </nuxt-link>
      </div>
      <div class="flex w-72 flex-col justify-between">
        <nuxt-link
          class="w-full truncate rounded-lg focus:no-underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-twitch"
          :to="`https://twitch.tv/${twitch.login}`"
          :title="twitch.nickname"
        >
          <span
            class="link inline-block text-2xl font-bold decoration-twitch underline-offset-4"
          >
            {{ twitch.nickname.repeat(1) }}
          </span>
        </nuxt-link>
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1">
            <use-time-ago :time="date" #="{ timeAgo }">
              <time :datetime="date.toISOString()"> loaded {{ timeAgo }} </time>
              <div
                ref="timeTooltipRef"
                class="tooltip tooltip-top tooltip-info box-content flex h-6 w-6 items-center justify-center rounded-full border bg-info focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-info"
                tabindex="0"
                :class="toValue(timeTooltip.focused) && 'tooltip-open'"
                :data-tip="date.toLocaleString()"
              >
                <icon size="16" name="carbon:data-enrichment" />
              </div>
            </use-time-ago>
          </div>
          <button
            class="btn btn-success btn-sm border border-success-content"
            :disabled="asyncState.isLoading.value"
            @click="emit('refresh')"
          >
            Refresh
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
      <div class="relative">
        <button
          v-if="!mustRevealConfirmDeleteDialog"
          ref="deleteButtonRef"
          class="btn btn-error btn-sm border border-error-content"
          @click="
            async () => {
              mustRevealConfirmDeleteDialog = true;
              await nextTick();
              cancelDeleteButtonRef?.focus();
            }
          "
        >
          Delete
          <icon name="ic:round-delete-outline" class="-ml-2" />
        </button>
        <div
          v-else
          class="card dropdown-content card-compact absolute top-0 z-[1] border-2 bg-base-100 p-2 text-base-content shadow"
        >
          <div class="card-body">
            <h3 class="card-title">Delete {{ twitch.nickname }} collection?</h3>
            <div class="flex gap-2">
              <button class="btn btn-error btn-sm grow" @click="emit('delete')">
                Delete
              </button>
              <button
                ref="cancelDeleteButtonRef"
                class="btn btn-outline btn-sm grow"
                @click="
                  async () => {
                    mustRevealConfirmDeleteDialog = false;
                    await nextTick();
                    deleteButtonRef?.focus();
                  }
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        v-if="!isCollectionSelected"
        class="btn btn-primary btn-sm"
        @click="emit('select')"
      >
        Select as active
      </button>
      <div
        v-else
        ref="collectionActiveTooltipRef"
        class="badge badge-primary badge-lg tooltip tooltip-top tooltip-primary font-bold focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
        tabindex="0"
        :class="toValue(collectionActiveTooltip.focused) && 'tooltip-open'"
        :data-tip="`Emotes of ${twitch.nickname} used in your pastas`"
      >
        Selected as active
        <icon size="16" name="carbon:data-enrichment" class="mb-1" />
      </div>
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
          class="input input-accent input-sm"
        />
      </div>
    </dev-only>
  </div>
</template>
<script setup lang="ts">
import { UseTimeAgo } from "@vueuse/components";
import type { ReadyUserCollectionAsyncState } from "~/pages/collections/users/[nickname].vue";

const timeTooltipRef = ref<HTMLDivElement>();
const timeTooltip = useFocus(timeTooltipRef);

const collectionActiveTooltipRef = ref<HTMLDivElement>();
const collectionActiveTooltip = useFocus(collectionActiveTooltipRef);
const mustRevealConfirmDeleteDialog = ref(false);
const deleteButtonRef = ref<HTMLButtonElement>();
const cancelDeleteButtonRef = ref<HTMLDivElement>();

const { asyncState, isCollectionSelected } = defineProps<{
  asyncState: ReadyUserCollectionAsyncState;
  isCollectionSelected: boolean;
}>();
const emit = defineEmits<{
  refresh: [];
  delete: [];
  select: [];
}>();

const collection = computed(() => asyncState.state.value);

const twitch = computed(() => collection.value.user.twitch);
const date = computed(() => new Date(collection.value.updatedAt));
</script>
