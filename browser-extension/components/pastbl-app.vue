<template>
  <div
    :class="[
      isContainerVisible
        // NOTE: use outline instead of border to avoid <<pastbl-rounded-button /> moving
        ? 'outline outline-2 outline-base-content'
        : 'pointer-events-none',
    ]"
    class="relative z-40 h-[400px] w-[320px] overflow-hidden rounded-lg rounded-br-3xl"
  >
    <div
      v-if="status === 'loading' && isContainerVisible"
      class="absolute inset-0 animate-pulse bg-gray-400 "
    />
    <pastbl-rounded-button
      class="pointer-events-auto visible absolute bottom-1 right-1 z-50 flex"
      @click="toggleVisibility"
    />
    <div
      v-show="isContainerVisible"
      class="flex h-full flex-col-reverse items-center"
    >
      <x-pastas-list
        v-if="status === 'ready'"
        class="bg-purple-800 p-2 text-white"
        :pastas
        @copy="copyPasta"
        @send="sendPasta"
      />
      <div
        v-if="status === 'not-authorized'"
        class="flex flex-col items-center gap-2"
      >
        <span class="text-lg">
          You are not authorized to
          <a
            class="link"
            :href="config.pastbl.baseUrl"
          >
            pastbl
          </a>
        </span>
        <authorize-to-twitch-button />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import PastblRoundedButton from "@/components/pastbl-rounded-button.vue";
import XPastasList from "@/components/x-pastas-list.vue";
import AuthorizeToTwitchButton from "@/components/authorize-to-twitch-button.vue";
import { isNotAuthorizedError } from "@/utils/pastas";
import { fetchFirstPastas, copyPasta, sendPasta } from "@/utils/handlers";

const isContainerVisible = ref(false);
const toggleVisibility = () => isContainerVisible.value = !isContainerVisible.value;

const status = ref<"loading" | "not-authorized" | "ready">("loading");
onMounted(async () => {
  await fetchFirstPastas()
    .then(() => status.value = "ready")
    .catch((error) => {
      if (isNotAuthorizedError(error)) {
        status.value = "not-authorized";
      }
    });
});
</script>
