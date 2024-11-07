<template>
  <div
    v-show="appVisibility.state"
    class="flex h-full flex-col items-center justify-end gap-3 text-2xl"
  >
    <div
      v-if="status === 'not-authorized-error'"
      class="contents"
    >
      <pastbl-not-authorized-hint />
      <pastbl-login-with-twitch class="btn-lg text-2xl" />
    </div>
    <div
      v-else-if="status === 'service-not-available-error'"
      class="contents"
    >
      {{ $t("serviceNotAvailable") }}
    </div>
    <div
      v-else-if="status === 'unknown-error'"
      class="contents"
    >
      <pastbl-something-went-wrong />
      <pastbl-describe-issue-here />
    </div>
    <pastas-list-initializing-skeleton
      v-else-if="status === 'initializing'"
    />
    <with-active-pasta-action-buttons
      v-else-if="status !== 'unstarted'"
      class="flex h-full flex-col items-center"
      #="{ showActions }"
    >
      <pasta-actions-hint class="px-2 text-center text-2xl" />
      <div class="flex h-full flex-col items-center">
        <pastbl-no-remote-pastas
          v-if="status === 'finished' && pastas.length === 0"
        />
        <pastas-list
          v-else-if="pastas.length > 0"
          class="h-[calc(100%-2rem)] w-[320px]"
          :pastas
          :cursor
          :load-more
          @show-actions="showActions"
          @response="onResponse"
        >
          <template #top>
            <div
              v-if="status === 'finished'"
              class="w-full bg-base-100 text-center text-accent"
            >
              {{ $t('noMorePastas') }}
            </div>
            <div
              v-else-if="status === 'loading'"
              class="w-full bg-base-100 text-center text-accent"
            >
              {{ $t('loading') }}
            </div>
          </template>
        </pastas-list>
      </div>
    </with-active-pasta-action-buttons>
  </div>
</template>
<script setup lang="ts">
import PastaActionsHint from "~/components/pastas/pasta-actions-hint.vue";
import PastasList from "~/components/pastas/list/pastas-list.vue";
import WithActivePastaActionButtons from "~/components/pastas/list/with-active-pasta-actions.vue";
import PastblNotAuthorizedHint from "~/components/pastbl-not-authorized-hint.vue";
import PastblLoginWithTwitch from "~/components/pastbl-login-with-twitch.vue";
import PastblSomethingWentWrong from "~/components/pastbl-something-went-wrong.vue";
import PastblDescribeIssueHere from "~/components/pastbl-describe-issue-here.vue";
import PastblNoRemotePastas from "~/components/pastbl-no-remote-pastas.vue";
import PastasListInitializingSkeleton from "~/components/pastas/list/pastas-list-initializing-skeleton.vue";
import { injectAppVisibility } from "~/utils/provide-inject-app-visibility";
import { $handlePastasLoadResponse } from "~/utils/pastas.store";

defineProps<{
  pastas: XPasta[];
  cursor: Nullish<number>;
  status: PastasLoadStatus;
  loadMore: GetPastasFn;
}>();

const appVisibility = injectAppVisibility();

async function onResponse(
  response: GetPastasResponse,
  container: HTMLElement | null,
) {
  if (!container) {
    throw new Error("container is null");
  }
  const oldElementHeight = container.scrollHeight;
  $handlePastasLoadResponse(response);
  await nextTick();
  const newElementHeight = container.scrollHeight;
  container.scrollTop = newElementHeight - oldElementHeight;
}
</script>
