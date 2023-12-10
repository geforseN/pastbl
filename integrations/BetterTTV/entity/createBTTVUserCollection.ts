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
    [`Channel emotes`, user.channelEmotes, "channel", `channel${user.id}`],
    [`Shared emotes`, user.sharedEmotes, "shared", `shared${user.id}`],
  ] as const;

  return new BTTVUserCollection(
    { avatarUrl: user.avatar, id: user.id, twitch: user.twitch },
    setEntries
      .filter(([, emotesList]) => emotesList.length)
      .map(([name, emotes, emoteType, id]) => {
        return new BTTVSet(
          {
            emotes,
            name,
            id,
          },
          (emote) => new BTTVEmote(emote, emoteType),
        );
      }),
  );
}
