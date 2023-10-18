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
        <chat-pasta-list>
          <template #user-nickname>
            <chat-pasta-nickname :user="userStore.user" />
          </template>
        </chat-pasta-list>
        <button
          class="btn btn-primary my-2 w-full text-xl"
          @click="
              () => {
                (pastaFormRef as any).twitchChatRef.textareaRef.focus();
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
        <pasta-form-responsive ref="pastaFormRef" />
        <load-emote-collection-form />
        <user-settings />
        <template #fallback>LOADING FORMS</template>
      </client-only>
    </div>
  </main>
</template>

<script setup lang="tsx">
useHead({ title: "pastbl" });

const pastaFormRef = ref();
const userStore = useUserStore();

const pastasStore = usePastasStore();

const uzySevenTVId = "623dec3a1aeb248de84964bf";
const uzyFirstEmoteCollectionId = "623dec3a1aeb248de84964bf";
const uzyBetterTTVUserId = "550ad384a607044d1a3dd29b";

// TODO later...
// WHEN current emote-set changes DO pastas text repopulate

onMounted(async () => {
  const {
    templateStrings,
    getBttvEmoteCollectionByUserId,
    getBttvGlobalEmoteCollection,
  } = await import("../integrations");

  const ffzUzy = await fetch(
    `https://api.frankerfacez.com/v1/user/${"UselessMouth".toLowerCase()}`,
  ).then((v) => v.json());
  const ffzGlobal = await fetch(
    `https://api.frankerfacez.com/v1/set/global`,
  ).then((v) => v.json());
  console.log({ ffzUzy, ffzGlobal });

  watch(
    () => pastasStore.latestPasta,
    async (latestPasta) => {
      if (!latestPasta || latestPasta.populatedText !== undefined) {
        return;
      }
      await until(emoteCollections).toMatch((array) => array.length !== 0, {
        timeout: 10_000,
        throwOnTimeout: true,
      });
      latestPasta.populatedText = getPastaValidTokens(latestPasta).reduce(
        (text, token) => {
          const collectionThatHasEmoteByToken = emoteCollections.value.find(
            (collection) => collection.has(token),
          );
          if (!collectionThatHasEmoteByToken) {
            return text;
          }
          const emoteByToken = collectionThatHasEmoteByToken.get(token)!;
          return text.replaceAll(
            token,
            // TODO default template string should be used IF could not specify collection name
            // collection should have property name, which can be 'SevenTv' or 'BetterTTV'
            templateStrings["default"](emoteByToken),
          );
        },
        latestPasta.text,
      );
    },
  );

  const { emoteCollections } = useEmotes([
    (async function populateBetterTTVGlobalEmoteSet() {
      const bttvGlobalCollection = await getBttvGlobalEmoteCollection();
      const bttvGlobalEmoteMap = new Map(
        bttvGlobalCollection.emotes.map((emote) => [emote.token, emote]),
      );
      pastasStore.populatePastas({
        emoteMap: bttvGlobalEmoteMap,
        templateString: templateStrings["BetterTTV"],
      });
      return bttvGlobalEmoteMap;
    })(),
    // (async function populateUselessMouthSevenTVFirstEmotesSet() {
    //   const uzy7TVCollection = await getFirstUzyEmoteSet();
    //   const uzy7TVEmoteMap = new Map<string, SevenTvEmote>(
    //     uzy7TVCollection.emotes.map((emote) => [emote.chatName, emote]),
    //   );
    //   pastasStore.populatePastas({
    //     emoteMap: uzy7TVEmoteMap,
    //     templateString: templateStrings["SevenTV"],
    //   });
    //   return uzy7TVEmoteMap;
    // })(),
    (async function populateUselessMouthBetterTTVEmotesSet() {
      const uzyBttvCollection =
        await getBttvEmoteCollectionByUserId(uzyBetterTTVUserId);
      const uzyBttvEmoteMap = new Map(
        uzyBttvCollection.emotes.map((emote) => [emote.token, emote]),
      );
      pastasStore.populatePastas({
        emoteMap: uzyBttvEmoteMap,
        templateString: templateStrings["BetterTTV"],
      });
      return uzyBttvEmoteMap;
    })(),
  ]);
});
</script>
<style>
html,
body {
  scrollbar-gutter: stable;
}
</style>
