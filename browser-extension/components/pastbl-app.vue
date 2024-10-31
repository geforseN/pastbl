<template>
  <div
    :class="[
      isContainerVisible ? 'bg-base-100' : 'pointer-events-none bg-transparent',
      status === 'loading' && 'loading',
    ]"
    class="relative h-[400px] w-[320px]  rounded-lg rounded-br-[30px] border-2 border-base-content p-2"
  >
    <pastbl-rounded-button
      class="pointer-events-auto absolute bottom-0 right-0 z-[60]"
      @click="toggleContainer"
    />
    <div
      v-show="isContainerVisible"
      class="flex h-full flex-col-reverse items-center"
    >
      <x-pastas-list
        v-if="status === 'ready'"
        class="absolute right-0 top-0 z-50 bg-purple-800 p-2 text-white"
        :pastas
        @copy="copyPasta"
        @send="sendPasta"
      />
      <!-- <template #error="{ error }"> -->
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
      <!-- </template> -->
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
const toggleContainer = () => isContainerVisible.value = !isContainerVisible.value;

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
