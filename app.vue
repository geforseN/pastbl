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
        <app-top-nav />
        <nuxt-layout>
          <nuxt-page />
        </nuxt-layout>
        <app-bottom-nav />
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

// use new DomParser()
// показывать процесс загрузки коллекции (можно переиспользовать headers вместе с asyncState  )
// добавить возможность удалить коллекцию пользователя

onMounted(() => {
  themeChange(false);
  document.documentElement.classList.remove("dark", "light");

  const emotesStore = useEmotesStore();
  const pastasStore = usePastasStore();

  $fetch("/api/twitch/user/psp1g").then(console.log);
  $fetch("/api/twitch/emotes/global").then(console.log);

  watch(
    () => storeToRefs(pastasStore).newPastas.value,
    async (newPastas, oldPastas) => {
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
      const emotesMapOfAddedPastas = getPastasEmotesMap(
        newPastas,
        emotesStore.findEmote,
      );
      for (const [pasta, emotes] of emotesMapOfAddedPastas) {
        pasta.populatedText = pasta.text;
        for (const emote of emotes) {
          const emoteTemplate = templateStrings[emote.source];
          const emoteAsString = emoteTemplate(emote);
          // const pastaElement = document.querySelector(
          //   `[data-pasta-id="${pastaId}"]`,
          // );
          // console.log({ pastaElement });
          pasta.populatedText = pasta.populatedText.replaceAll(
            emote.token,
            emoteAsString,
          );
        }
      }
      pastasStore.trigger();
    },
  );
});
</script>
<style>
.ffz-x {
}
.ffz-y {
}
.ffz-w {
}
.ffz-cursed {
}
</style>

<!-- 
  pages:
   - index: показывает все возможные действия, а  что именно смотри ниже  
     - pastas/create
     - pastas/edit/:pastaId
     - pastas/find?...MUST_BE_MANY_PARAMS_HERE

    по нажатию на кнопку 'Change pasta' n-ой пасты из списка паст (список отображается в левой колонке)
      - форма для редактирования пасты (форма отображается в правой колонке)
 -->

<!--     [() => newPastas.value, () => emotesStore.activeUserEmotes],
    async (
      [newPastas, newActiveUserEmotes],
      [oldPastas, oldActiveUserEmotes],
    ) => {
      const userEmoteSizes = {
        next: Object.values(newActiveUserEmotes || {})
          .map((emoteMap) => emoteMap.size)
          .join(", "),
        prev: Object.values(oldActiveUserEmotes || {})
          .map((emoteMap) => emoteMap.size)
          .join(", "),
      };
      const pastasLengths = {
        next: newPastas.length,
        prev: oldPastas.length,
      };
      console.log({
        pastasLengths,
        userEmoteSizes,
      });
      if (
        !(newPastas.length || oldPastas.length) &&
        userEmoteSizes.next === userEmoteSizes.prev
      ) {
        return console.log("FAST RETURN");
      } -->

<!-- 
         // hooks: {
  //   async close() {
  //     console.log("Closing nitro server...");
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     console.log("Task is done!");
  //     const stream = fs.createWriteStream("./index.txt");
  //     stream.write("Hello, World!");
  //     stream.end();
  //   },
  //   ready(nuxt) {
  //     const signals = ["SIGINT", "SIGTERM"] as const;
  //     const handler = async (signal: (typeof signals)[number]) => {
  //       try {
  //         signals.forEach((signal) => process.removeListener(signal, handler));
  //         await nuxt.close();
  //         console.log("Closing nitro server...");
  //         console.log("Closing nitro server...");
  //         console.log("Closing nitro server...");
  //         console.log("Closing nitro server...");
  //         const stream = fs.createWriteStream(`./${signal}.txt`);
  //         stream.write("Hello, World!");
  //         stream.end();
  //         process.kill(process.pid, signal);
  //       } catch (error) {
  //         console.error("error during shutdown", error);
  //         process.exit(1);
  //       }
  //     };
  //     signals.forEach((signal) => process.on(signal, handler));
  //   },
  // },
       -->
