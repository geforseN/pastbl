import type {
  AvailableEmoteSource,
  IEmote,
  IUserEmoteCollection,
} from "~/integrations";

// TODO: make user decide which order user collection sources should be
const _orderedSources = ["FrankerFaceZ", "BetterTTV", "SevenTV"] as const;

// TODO: to global emotes user should decide which sources to include

// FIXME: refactor code, remove repetitions
// TODO: should add IndexedDB store, which will have indexes for global emotes and current user emotes
// TODO: should move 'find emotes logic' to store indexes
// NOTE: now all global emotes and current user emotes loaded in RAM, can cache it (should compute again once global emotes or current user emotes changed)
export async function veryCoolAlgorithm(newPastas: MegaPasta[]) {
  const { idb } = await import("~/client-only/IndexedDB/index");
  const activeUserCollection = {
    collections: [],
  } as unknown as IUserEmoteCollection;
  // TODO use emotesStore more
  const emotesStore = useEmotesStore();
  const validTokensToGet = [
    ...new Set(newPastas.flatMap((pasta) => pasta.validTokens)),
  ];
  const globalEmoteCollections =
    await idb.emoteCollections.global.getAllCollections();
  const globalEmoteEntries = Object.values(globalEmoteCollections).map(
    (collection) => {
      return [collection.source, collection.sets.flatMap((set) => set.emotes)];
    },
  ) as [AvailableEmoteSource, IEmote[]][];

  const currentCollectionEmoteEntries = Object.values(
    activeUserCollection?.collections || {},
  ).map((collection) => {
    return [collection.source, collection.sets.flatMap((set) => set.emotes)];
  });

  const emoteEntries = [
    // TODO sort emoteEntries in some order
    // now order is unpredictable, probably FFZ => BTTV => 7TV
    ...globalEmoteEntries,
    // TODO sort emoteEntries in some order
    // now order is unpredictable, probably FFZ => BTTV => 7TV
    ...currentCollectionEmoteEntries,
  ] as [AvailableEmoteSource, IEmote[]][];

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

  // TODO: line below is very useless, can remove it when will can data properly
  foundEmotes.forEach((emote) => emotesStore.emotes.set(emote.token, emote));
  console.log({ foundEmotes });
  return foundEmotes;
}
