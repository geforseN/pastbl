<template>
  <div
    :class="[
      !isContainerVisible && 'pointer-events-none',
    ]"
    class="absolute bottom-0 right-1/2 z-40 h-[400px] w-[320px] overflow-hidden rounded-lg rounded-br-3xl"
  >
    <div
      v-if="pastasLoad.status === 'loading' && isContainerVisible"
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
        v-if="pastasLoad.status === 'ready'"
        class="size-full bg-base-100 text-base-content"
        :pastas
        @copy="copyPasta"
        @send="sendPasta"
      />
      <div
        v-if="pastasLoad.status === 'not-authorized'"
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
        v-if="pastasLoad.status === 'unknown-error'"
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
import { copyPasta, sendPasta } from "~/utils/handlers";
import { usePastasLoad } from "@/composables/usePastasLoad";

const isContainerVisible = ref(false);
const toggleVisibility = () => isContainerVisible.value = !isContainerVisible.value;

const pastasLoad = reactive(usePastasLoad());

onMounted(async () => {
  await pastasLoad.init(true);
});
</script>
