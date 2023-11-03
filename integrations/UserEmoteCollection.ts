import type {
  IEmote,
  IEmoteSet,
  IEmoteCollection,
  IEmoteCollectionOwner,
} from ".";
import type { IndexedDBEmoteCollection } from "~/client-only/IndexedDB";

export class UserEmoteCollection implements IEmoteCollection {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public name: string,
    public source: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch",
    public updatedAt: number,
    public sets: IEmoteSet[],
    public owner: IEmoteCollectionOwner,
  ) {}

  static async fromIDBCollection(
    idbCollection: IndexedDBEmoteCollection,
    loadEmoteFromIdbCB: (
      idbEmoteId: IEmote["id"],
    ) => Promise<IEmote | undefined>,
  ) {
    return new UserEmoteCollection(
      idbCollection.name,
      idbCollection.source,
      idbCollection.updatedAt,
      await Promise.all(
        idbCollection.sets.map(async (idbSet) => {
          const { emoteIds, ...set } = idbSet;
          return {
            ...set,
            emotes: await Promise.all(emoteIds.map(loadEmoteFromIdbCB)).then(
              (emoteSet) =>
                emoteSet.filter((emote) => emote !== undefined) as IEmote[],
            ),
          };
        }),
      ),
      idbCollection.owner,
    );
  }
}
