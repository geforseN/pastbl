import type { BetterTTVApiUser } from "../BetterTTV.api";
import { BTTVEmote } from "./BetterTTVEmote";
import { BTTVSet } from "./BetterTTVSet";
import {
  BTTVUserCollection,
  type BetterTTVUserCollection,
} from "./BetterTTVUserCollection";

export function createBTTVUserCollection(
  user: BetterTTVApiUser & { twitch: { username: Lowercase<string> } },
): BetterTTVUserCollection {
  const setEntries = [
    [
      `BetterTTV ${user.twitch.username} Channel emotes`,
      user.channelEmotes,
      "channel",
    ],
    [
      `BetterTTV ${user.twitch.username} Shared emotes`,
      user.sharedEmotes,
      "shared",
    ],
  ] as const;

  return new BTTVUserCollection(
    { ...user, avatarUrl: user.avatar },
    setEntries
      .filter(([, emotesList]) => emotesList.length)
      .map(([name, emotes, emoteType]) => {
        return new BTTVSet(
          {
            emotes,
            name,
            // NOTE: user channelEmotes and sharedEmotes will have the same id
            id: user.id,
          },
          (emote) => new BTTVEmote(emote, emoteType),
        );
      }),
  );
}
