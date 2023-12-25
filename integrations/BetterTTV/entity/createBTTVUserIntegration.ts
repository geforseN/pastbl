import type { BetterTTVApiUser } from "../BetterTTV.api";
import { BTTVEmote } from "./BetterTTVEmote";
import { BTTVSet } from "./BetterTTVSet";
import {
  BTTVUserIntegration,
  type BetterTTVUserIntegration,
} from "./BetterTTVUserIntegration";

export function createBTTVUserIntegration(
  user: BetterTTVApiUser & { twitch: { username: Lowercase<string> } },
): BetterTTVUserIntegration {
  const setEntries = [
    [`Channel emotes`, user.channelEmotes, "channel", `channel${user.id}`],
    [`Shared emotes`, user.sharedEmotes, "shared", `shared${user.id}`],
  ] as const;

  return new BTTVUserIntegration(
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
