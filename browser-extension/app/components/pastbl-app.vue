<template>
  <div
    :class="[
      !isContainerVisible && 'pointer-events-none',
    ]"
    class="absolute bottom-0 right-1/2 z-40 h-[400px] w-[320px] overflow-hidden rounded-lg rounded-br-3xl"
  >
    <div
      v-if="status === 'loading' && isContainerVisible"
      class="absolute inset-0 animate-pulse bg-gray-400"
    />
    <pastbl-rounded-button
      class="pointer-events-auto visible absolute bottom-px right-px z-50 flex"
      @click="toggleVisibility"
    />
    <div
      v-show="isContainerVisible"
      class="flex h-full flex-col-reverse items-center bg-purple-900 p-2"
    >
      <pastbl-pastas-list
        v-if="status === 'ready'"
        class="bg-base-100 text-base-content"
        :pastas
        @copy="copyPasta"
        @send="sendPasta"
      />
      <div
        v-if="status === 'not-authorized'"
        class="flex flex-col items-center gap-2"
      >
        <span class="text-lg">
          {{ i18n.t('youAreNotAuthorizedTo') }}
          <a
            class="link"
            :href="config.pastbl.baseUrl"
          >
            pastbl
          </a>
        </span>
        <pastbl-login-with-twitch />
      </div>
      <div
        v-if="status === 'unknown-error'"
        class="flex flex-col items-center text-lg"
      >
        {{ i18n.t('somethingWentWrong') }}
        <!-- eslint-disable @stylistic/max-len  -->
        <a
          class="link link-accent"
          href="https://github.com/geforseN/pastbl/issues/new?assignees=&labels=&projects=&template=bug_report.md&title="
        >
          <!-- eslint-enable @stylistic/max-len  -->
          {{ i18n.t('createIssueHere') }}
        </a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import PastblRoundedButton from "~/components/pastbl-rounded-button.vue";
import PastblPastasList from "~/components/pastbl-pastas-list.vue";
import PastblLoginWithTwitch from "~/components/pastbl-login-with-twitch.vue";
import { isNotAuthorizedError } from "~/utils/pastas";
import { fetchFirstPastas, copyPasta, sendPasta } from "~/utils/handlers";

const isContainerVisible = ref(false);
const toggleVisibility = () => isContainerVisible.value = !isContainerVisible.value;

const status = ref<
  | "loading"
  | "ready"
  | "not-authorized"
  | "unknown-error"
>("loading");

onMounted(async () => {
  await fetchFirstPastas()
    .then(() => status.value = "ready")
    .catch((error) => {
      status.value = isNotAuthorizedError(error)
        ? "not-authorized"
        : "unknown-error";
    });
});
</script>
