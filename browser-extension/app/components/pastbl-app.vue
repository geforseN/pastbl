<template>
  <div
    id="pastbl-app"
    :class="[
      !appVisibility.state && 'pointer-events-none',
    ]"
    class="relative h-[400px] w-[320px] overflow-hidden rounded-lg rounded-b-3xl"
  >
    <div
      v-if="pastasLoad.status === 'loading' && appVisibility.state"
      class="absolute inset-0 animate-pulse bg-gray-400"
    />
    <pastbl-main-button
      class="pointer-events-auto absolute bottom-0 right-0 z-50"
      @click="appVisibility.toggle"
    />
    <div
      v-show="appVisibility.state"
      class="h-full"
    >
      <pastbl-settings :is-app-visible="appVisibility.state" />
      <pastbl-with-active-pasta-action-buttons
        v-if="pastasLoad.status === 'ready'"
        class="flex h-full flex-col items-center bg-purple-900 p-2 text-white"
        #="{ showActions }"
      >
        <pastbl-pasta-actions-hint />
        <pastbl-pastas-list
          :pastas
          v-on="{ showActions }"
        />
        <div class="flex h-[4.5rem] w-full flex-col justify-end bg-base-100">
          <div class="size-full rounded-full border-t-2 bg-purple-900" />
        </div>
      </pastbl-with-active-pasta-action-buttons>
      <div
        v-if="pastasLoad.status === 'not-authorized'"
        class="flex flex-col items-center gap-2"
      >
        <pastbl-not-authorized-hint />
        <pastbl-login-with-twitch />
      </div>
      <div
        v-if="pastasLoad.status === 'unknown-error'"
        class="flex flex-col items-center text-lg"
      >
        <pastbl-something-went-wrong />
        <pastbl-describe-issue-here />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import PastblMainButton from "~/components/pastbl-main-button.vue";
import PastblPastasList from "~/components/pastbl-pastas-list.vue";
import PastblLoginWithTwitch from "~/components/pastbl-login-with-twitch.vue";
import PastblWithActivePastaActionButtons from "~/components/pastbl-with-active-pasta-actions.vue";
import PastblPastaActionsHint from "~/components/pastbl-pasta-actions-hint.vue";
import PastblNotAuthorizedHint from "~/components/pastbl-not-authorized-hint.vue";
import PastblSomethingWentWrong from "~/components/pastbl-something-went-wrong.vue";
import PastblDescribeIssueHere from "~/components/pastbl-describe-issue-here.vue";
import PastblSettings from "~/components/pastbl-settings.vue";
import { usePastasLoad } from "~/composables/usePastasLoad";
import { useBool } from "@/composables/useBool";

const appVisibility = reactive(useBool());

const pastasLoad = reactive(usePastasLoad());

onMounted(async () => {
  await pastasLoad.init(true);
});
</script>
