<template>
  <div>
    <Head>
      <Link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <Link rel="manifest" href="/site.webmanifest" />
    </Head>
    <Body lang="en">
      <div class="relative grid grid-rows-layout">
        <top-nav />
        <nuxt-layout>
          <nuxt-page />
        </nuxt-layout>
        <bottom-nav />
        <u-notifications>
          <template #title="{ title }">
            <span class="text-xl">{{ title }}</span>
          </template>
          <template #description="{ description }">
            <span class="font-bold">{{ description }}</span>
          </template>
        </u-notifications>
      </div>
    </Body>
  </div>
</template>
<script setup lang="ts">
import { themeChange } from "theme-change";
import { templateStrings } from "./integrations";

useHead({ title: process.dev ? "pastbl - dev" : "pastbl" });

onMounted(() => {
  themeChange(false);
  document.documentElement.classList.remove("dark", "light");

  const emotesStore = useEmotesStore();
  const pastasStore = usePastasStore();
  const { newPastas } = storeToRefs(pastasStore);

  watch(
    () => newPastas.value,
    async (newPastas, oldPastas) => {
      console.log("length", {
        newLength: newPastas.length,
        oldLength: oldPastas.length,
      });
      if (!oldPastas.length && !newPastas.length) {
        return;
      }
      await Promise.allSettled([
        until(() => emotesStore.activeUserEmotes).toMatch(
          (userEmotes) =>
            Object.values(userEmotes || {}).some(
              (sourceMap) => !!sourceMap.size,
            ),
          { timeout: 3_000 },
        ),
        until(() => emotesStore.globalEmotes).toMatch(
          (globalEmotes) =>
            Object.values(globalEmotes || {}).every(
              (sourceMap) => !!sourceMap.size,
            ),
          { timeout: 3_000 },
        ),
      ]);
      const addedPastasRecord = findEmotesInPastas(newPastas, (token) => {
        const userEmote = emotesStore.findEmoteInActiveUser(token);
        if (userEmote) {
          return userEmote;
        }
        const globalEmote = emotesStore.findEmoteInGlobal(token);
        if (globalEmote) {
          return globalEmote;
        }
      });
      for (const [pastaId, emotes] of Object.entries(addedPastasRecord)) {
        const pasta = newPastas.find((pasta) => pasta.id === Number(pastaId));
        assert.ok(pasta);
        pasta.populatedText = pasta.text;
        for (const token of pasta.validTokens) {
          const emote = emotes.find((emote) => emote.token === token);
          if (!emote) {
            continue;
          }
          const emoteTemplate = templateStrings[emote.source];
          const emoteAsString = emoteTemplate(emote);
          pasta.populatedText = pasta.populatedText.replaceAll(
            token,
            emoteAsString,
          );
        }
      }
      pastasStore.trigger();
    },
  );
});
</script>

<!-- 
  pages:
   - index: показывает все возможные действия, а  что именно смотри ниже  
     - pastas/create
     - pastas/edit/:pastaId
     - pastas/find?...MUST_BE_MANY_PARAMS_HERE

    по нажатию на кнопку 'Change pasta' n-ой пасты из списка паст (список отображается в левой колонке)
      - форма для редактирования пасты (форма отображается в правой колонке)
 -->
