<template>
  <div
    id="pastbl-app"
    :class="[
      !appVisibility.state && 'pointer-events-none',
    ]"
    class="relative h-[400px] w-[320px] overflow-hidden rounded-lg rounded-b-3xl"
  >
    <pastbl-main-button
      class="pointer-events-auto absolute bottom-0 right-0 z-40"
      @click="onMainButtonClick"
    />
    <!-- TODO: rewrite template -->
    <div
      v-show="appVisibility.state"
      class="flex h-full flex-col items-center bg-purple-900 p-2 text-white"
    >
      <pastbl-settings :is-app-visible="appVisibility.state" />
      <div
        v-if="pastasLoad.status === 'not-authorized-error'"
        class="flex flex-col items-center gap-2"
      >
        <pastbl-not-authorized-hint />
        <pastbl-login-with-twitch />
      </div>
      <div
        v-else-if="pastasLoad.status === 'unknown-error'"
        class="flex flex-col items-center text-lg"
      >
        <pastbl-something-went-wrong />
        <pastbl-describe-issue-here />
      </div>
      <pastbl-with-active-pasta-action-buttons
        v-else
        #="{ showActions }"
      >
        <!--
     pastasLoad.status === 'ready'
  || pastasLoad.status === 'loading'
  || pastasLoad.status === 'unstarted'
  || pastasLoad.status === 'initializing'
  || pastasLoad.status === 'finished'
-->
        <pastbl-pasta-actions-hint />
        <div
          v-if="pastasLoad.status === 'initializing'"
          class="h-full animate-pulse text-4xl"
        >
          {{ i18n.t('loading') }}
        </div>
        <div>
          ADD SOME PASTAS ON PASTBL SITE
          <!-- TODO  i18n -->
        </div>
        <pastbl-pastas-list
          :pastas
          :cursor
          loading-class="relative z-30 outline outline-accent empty:outline-0"
          :load-more="async (cursor) => {
            return await pastasLoad.execute(cursor)
          }"
          @show-actions="showActions"
          @response="onLoadMore"
        />
        <div class="flex h-[4.5rem] w-full flex-col justify-end bg-base-100">
          <div class="size-full rounded-full border-t-2 bg-purple-900" />
        </div>
      </pastbl-with-active-pasta-action-buttons>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useBool } from "~/composables/useBool";
import { fetchPastas } from "~/utils/pastas";
import { pastas, cursor } from "~/utils/pastas.store";
import { useLazyPastasLoad } from "~/composables/usePastasLoad";
import PastblPastasList from "./pastbl-pastas-list.vue";
import PastblLoginWithTwitch from "./pastbl-login-with-twitch.vue";
import PastblWithActivePastaActionButtons from "./pastbl-with-active-pasta-actions.vue";
import PastblPastaActionsHint from "./pastbl-pasta-actions-hint.vue";
import PastblNotAuthorizedHint from "./pastbl-not-authorized-hint.vue";
import PastblSomethingWentWrong from "./pastbl-something-went-wrong.vue";
import PastblDescribeIssueHere from "./pastbl-describe-issue-here.vue";
import PastblSettings from "./pastbl-settings.vue";
import PastblMainButton from "./pastbl-main-button.vue";

const appVisibility = reactive(useBool());

const pastasLoad = reactive(useLazyPastasLoad(fetchPastas));

let wasMainButtonPressed = false;
async function onMainButtonClick() {
  appVisibility.toggle();
  if (!wasMainButtonPressed) {
    wasMainButtonPressed = true;
    const response = await pastasLoad.execute();
    pastas.value.unshift(...response.pastas.toReversed());
    cursor.value = response.cursor;
  }
}

async function onLoadMore(
  response: { pastas: XPasta[]; cursor: number | null },
  container: HTMLElement | null,
) {
  if (!container) {
    throw new Error("container is null");
  }
  const oldElementHeight = container.scrollHeight;
  pastas.value.unshift(...response.pastas.toReversed());
  cursor.value = response.cursor;
  await nextTick();
  const newElementHeight = container.scrollHeight;
  container.scrollTop = newElementHeight - oldElementHeight;
}
</script>
