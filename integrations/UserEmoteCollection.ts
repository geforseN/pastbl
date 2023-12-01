import type {
  IEmote,
  IEmoteSet,
  IEmoteCollection,
  IEmoteCollectionOwner,
} from ".";
import type { IndexedDBEmoteCollection } from "~/client-only/IndexedDB";

export async function populateUserEmoteCollection(
  idbCollection: IndexedDBEmoteCollection,
  loadEmoteFromIdb: (idbEmoteId: IEmote["id"]) => Promise<IEmote | undefined>,
): Promise<IEmoteCollection> {
  return new UserEmoteCollection(
    idbCollection.name,
    idbCollection.source,
    idbCollection.updatedAt,
    idbCollection.owner,
    await Promise.all(
      idbCollection.sets.map(async (idbSet) => {
        const { emoteIds, ...set } = idbSet;
        return {
          ...set,
          emotes: await Promise.all(emoteIds.map(loadEmoteFromIdb)).then(
            (emoteSet) =>
              emoteSet.filter((emote): emote is IEmote => emote !== undefined),
          ),
        };
      }),
    ),
  );
}

class UserEmoteCollection implements IEmoteCollection {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public name: string,
    public source: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch",
    public updatedAt: number,
    public owner: IEmoteCollectionOwner,
    public sets: IEmoteSet[],
  ) {}
}
