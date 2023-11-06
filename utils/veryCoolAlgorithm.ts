import type {
  AvailableEmoteSources,
  IEmote,
  IUserEmoteCollection,
} from "~/integrations";

// TODO: make user decide which order user collection sources should be
const _orderedSources = ["FrankerFaceZ", "BetterTTV", "SevenTV"] as const;

// TODO: to global emotes user should decide which sources to include

export async function veryCoolAlgorithm(newPastas: MegaPasta[]) {
  const keyValueStore = await import("~/client-only/IndexedDB").then(
    ({ getKeyValueStore }) => getKeyValueStore(),
  );
  const activeUserCollection = (await keyValueStore.transaction.store.get(
    "activeUserCollection",
  )) as IUserEmoteCollection | undefined;
  const emotesStore = useEmotesStore();
  assert.ok(activeUserCollection);
  const validTokensToGet = [
    ...new Set(newPastas.flatMap((pasta) => pasta.validTokens)),
  ];
  const emoteEntries = Object.values(activeUserCollection.collections).map(
    (collection) => {
      return [collection.source, collection.sets.flatMap((set) => set.emotes)];
    },
  ) as [AvailableEmoteSources, IEmote[]][];
  // TODO sort emoteEntries in some order
  // now order is unpredictable, probably FFZ => BTTV => 7TV
  const foundEmotes = validTokensToGet.reduce((emotes, token) => {
    const tokenList = emoteEntries.find(([, emotes]) =>
      emotes.some((emote) => emote.token === token),
    )?.[1];
    if (!tokenList) {
      return emotes;
    }
    emotes.push(
      tokenList.find((emote) => emote.token === token) ||
        raise("Somehow emote is missed"),
    );
    return emotes;
  }, [] as IEmote[]);

  foundEmotes.forEach((emote) => emotesStore.emotes.set(emote.token, emote));
  console.log({ foundEmotes });
  return foundEmotes;
}
