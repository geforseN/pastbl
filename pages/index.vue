<template>
  <main
    class="mt-2 flex w-full flex-col items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <!-- NOTE: client only is used here because pastaStore and pastasStore persist data in localStorage, which is client only -->
    <!-- NOTE: for persist pinia-plugin-persistedstate is used, 
        for nuxt3 by default it uses cookie persist, but 
        for some reason, pasta with length over ~400 char is not saved in cookie, so 
        localStorage is used for persist, which does not behave like that with long pasta text
      -->
    <client-only>
      <div class="flex flex-col-reverse go-brr:flex-col">
        <pasta-list>
          <template #user-nickname>
            <user-nickname :user="userStore.user" />
          </template>
        </pasta-list>
        <button
          class="btn btn-primary my-2 w-full text-xl"
          @click="
              () => {
                (pastaFromResponsiveRef as any).twitchChatRef.textareaRef.focus();
              }
            "
        >
          go create pasta
        </button>
      </div>
      <template #fallback>LOADING LIST AND BUTTON</template>
    </client-only>
    <div class="flex w-min flex-col gap-y-4">
      <client-only>
        <pasta-form-responsive ref="pastaFromResponsiveRef" />
        <user-settings />
        <template #fallback>LOADING FORMS</template>
      </client-only>
    </div>
  </main>
</template>

<script setup lang="tsx">
const pastaFromResponsiveRef = ref();
const userStore = useUserStore();

const pastasStore = usePastasStore();

// TODO watch:
// WHEN pastasStore.pastas receives new pasta THEN do text populate
// this may stop doing pasta text population on every page refresh

// TODO later...
// WHEN current emote-set changes DO pastas text repopulate

onMounted(async () => {
  const fulfilledEmotesSets = await Promise.allSettled([
    (async function populateBetterTTVGlobalEmoteSet() {
      const bttvGlobalSet = await getBetterTTVGlobalEmoteSet();
      const bttvGlobalEmotesMap = new Map(
        bttvGlobalSet.emotes.map((emote) => [emote.chatName, emote]),
      );
      pastasStore.populatePastas({
        emoteMap: bttvGlobalEmotesMap,
        templateString: BetterTTVEmoteString,
      });
      return bttvGlobalEmotesMap;
    })(),
    (async function populateUselessMouthSevenTVFirstEmotesSet() {
      const uzy7TvSet = await getFirstUzyEmoteSet();
      const uzy7TvemoteMap = new Map<string, SevenTvEmote>(
        uzy7TvSet.emotes.map((emote) => [emote.chatName, emote]),
      );
      pastasStore.populatePastas({
        emoteMap: uzy7TvemoteMap,
        templateString: SevenTVEmoteString,
      });
      return uzy7TvemoteMap;
    })(),
    (async function populateUselessMouthBetterTTVEmotesSet() {
      const uzyBttvSet = await getBetterTTVUzyEmotesSet();
      const uzyBttvEmoteMap = new Map<string, SevenTvEmote>(
        uzyBttvSet.emotes.map((emote) => [emote.chatName, emote]),
      );
      pastasStore.populatePastas({
        emoteMap: uzyBttvEmoteMap,
        templateString: BetterTTVEmoteString,
      });
      return uzyBttvEmoteMap;
    })(),
  ]);

  return console.log(fulfilledEmotesSets);
});
</script>
<style>
html,
body {
  scrollbar-gutter: stable;
}
</style>
