import {
  BTTVCollection,
  type BetterTTVCollection,
} from "./BetterTTVCollection";
import { BTTVEmote } from "./BetterTTVEmote";
import { BTTVSet } from "./BetterTTVSet";

export async function createBTTVUserCollection(
  bttvState: NonNullable<BTTVAsyncState["state"]["value"]>,
  userTwitchNickname: string,
): Promise<BetterTTVCollection> {
  const setEntries = [
    [
      `BetterTTV ${userTwitchNickname} Channel emotes`,
      bttvState.channelEmotes,
      "channel",
    ],
    [
      `BetterTTV ${userTwitchNickname}Shared emotes`,
      bttvState.sharedEmotes,
      "shared",
    ],
  ] as const;

  return new BTTVCollection(
    `BetterTTV ${userTwitchNickname} Emotes Collection`,
    setEntries
      .filter(([, emotesList]) => emotesList.length)
      .map(([name, emotes, emoteType]) => {
        return new BTTVSet(
          {
            emotes,
            name,
            id: bttvState.id,
          },
          (emote) => new BTTVEmote(emote, emoteType),
        );
      }),
  );
}
