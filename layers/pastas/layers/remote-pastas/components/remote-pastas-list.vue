<template>
  <div
    ref="remotePastasList"
    :class="appConfig.pastaList.heights"
    class="chat-pasta-list overflow-y-auto"
  >
    <chat-pasta
      v-for="pasta of remotePastas.list.value"
      :key="`${pasta.id}:${pasta.text}`"
      v-bind="pasta"
      @copy="pastasStore.copyPasta(pasta)"
      @edit="navigateTo(useLocalePath()(`/pastas/edit/${pasta.id}`))"
      @remove="
        () => {
          /* TODO: move to file chat-pasta-server-list */
        }
      "
      @populate="
        (pastaTextContainer) => {
          populatePasta(
            pastaTextContainer,
            makeValidPastaTokens(pasta.text),
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
</template>
<script setup lang="ts">
const appConfig = useAppConfig();

const userStore = useUserStore();
const emotesStore = useEmotesStore();
const pastasStore = usePastasStore();

const remotePastasListRef = useTemplateRef("remotePastasList");
const remotePastas = useRemotePastas(remotePastasListRef);
</script>
