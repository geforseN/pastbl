import type { IBetterTTVApi } from "../api";
import { BTTVEmote, type IBetterTTVEmote } from "./BetterTTVEmote";
import { BetterTTVSet } from "./BetterTTVSet";
import {
  BTTVUserIntegration,
  type BetterTTVUserIntegration,
} from "./BetterTTVUserIntegration";

export function createBTTVUserIntegration(
  user: IBetterTTVApi["User"] & { twitch: { login: TwitchUserLogin } },
): BetterTTVUserIntegration {
  const setEntries = [
    {
      set: {
        name: "Channel emotes",
        emotes: user.channelEmotes,
        id: `channel${user.id}`,
      },
      emoteType: "channel" as const,
    },
    {
      set: {
        name: "Shared emotes",
        emotes: user.sharedEmotes,
        id: `shared${user.id}`,
      },
      emoteType: "shared" as const,
    },
  ].filter((entry) => entry.set.emotes.length);

  return new BTTVUserIntegration(
    { avatarUrl: user.avatar, id: user.id, twitch: user.twitch },
    setEntries.map(({ emoteType, set }) => {
      return new BetterTTVSet(
        set.emotes.map(
          (emote): IBetterTTVEmote => new BTTVEmote(emote, emoteType),
        ),
        set.id,
        set.name,
      );
    }),
  );
}
