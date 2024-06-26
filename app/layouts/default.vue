<template>
  <div
    class="mt-2 flex flex-col items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <slot />
    <!-- TODO: add components, template is too big  -->
    <slot name="leftColumn">
      <chat-pasta-list-hints>
        <client-only>
          <u-tabs
            :items="tabs"
            class="foo !space-y-0 border border-base-content"
          >
            <template #item="{ item }">
              <div
                v-if="
                  item.key === 'server' &&
                  !userStore.pastasWorkMode.canHaveServerMode
                "
                class="foo m-0 flex min-w-[352px] flex-col flex-wrap p-2 sm:min-w-[430px]"
              >
                <h3 class="text-xl">
                  <strong>
                    {{ $t("Fulfil_the_conditions") + ": " }}
                  </strong>
                </h3>
                <ul class="ml-4 list-disc">
                  <li
                    v-if="
                      userStore.pastasWorkMode.canHaveServerModeStatus.includes(
                        'not-logged-in',
                      )
                    "
                  >
                    <samp>
                      <auth-twitch-login-link-button
                        class="btn-xs w-full text-sm"
                      />
                    </samp>
                  </li>
                  <li
                    v-if="
                      userStore.pastasWorkMode.canHaveServerModeStatus.includes(
                        'offline',
                      )
                    "
                  >
                    <samp>{{ $t("restore-internet-connection") }}</samp>
                  </li>
                </ul>
              </div>
              <div
                v-if="
                  item.key === 'server' &&
                  userStore.pastasWorkMode.canHaveServerMode
                "
                ref="serverPastasListRef"
                :class="[...chatPastaListConfig.tailwind.heights]"
                class="chat-pasta-list overflow-y-auto"
                @mouseover="throttledMouseover"
              >
                <chat-pasta
                  v-for="pasta of serverPastas.list.value"
                  :key="`${pasta.id}:${pasta.text}`"
                  v-bind="pasta"
                  @copy="userStore.copyPasta(pasta)"
                  @edit="
                    navigateTo(useLocalePath()(`/pastas/edit/${pasta.id}`))
                  "
                  @remove="
                    () => {
                      /* TODO: move to file chat-pasta-server-list */
                    }
                  "
                  @populate="
                    (pastaTextContainer) => {
                      populatePasta(
                        pastaTextContainer,
                        makeValidTokensFromPastaText(pasta.text),
                        emotesStore.findEmote,
                      );
                    }
                  "
                  @show-tag-context-menu="
                    (event, tag) => {
                      console.log(event, tag);
                    }
                  "
                >
                  <template #creatorData>
                    <chat-pasta-creator-data
                      :badges-count="userStore.user.badges.count.state"
                      :nickname="userStore.user.nickname_"
                      :nickname-color="userStore.user.debounced.nickname.color"
                    />
                  </template>
                </chat-pasta>
              </div>
              <chat-pasta-list
                v-if="item.key === 'client' && pastasStore.canShowPastas"
                :items="pastasStore.pastasToShow"
                @mouseover="throttledMouseover"
                @remove-pasta="pastasStore.removePasta"
              />
            </template>
          </u-tabs>
        </client-only>
      </chat-pasta-list-hints>
    </slot>
  </div>
</template>
<script setup lang="ts">
import type { ChatPastaList } from "#build/components";
import { chatPastaList as chatPastaListConfig } from "~~/config/css.js";

const tabs = [
  {
    label: "Server",
    key: "server",
  },
  {
    label: "Client",
    key: "client",
  },
];

const pastasStore = usePastasStore();
const userStore = useUserStore();
const emotesStore = useEmotesStore();

const serverPastasListRef = ref<HTMLElement>();

const serverPastas = useServerPastas(serverPastasListRef);

const emoteOnHover = injectEmoteOnHover();

const throttledMouseover = useThrottleFn(
  emoteOnHover.allEmotesHandler,
  100,
  true,
);
</script>
<style>
.chat-pasta-list {
  max-height: 50dvh;
}

@media (min-width: 890px) {
  .chat-pasta-list {
    max-height: 60dvh;
  }
}

.foo {
  scrollbar-gutter: stable;
}
</style>
