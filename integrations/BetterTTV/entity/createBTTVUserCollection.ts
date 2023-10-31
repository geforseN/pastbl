import type { BetterTTVApiUser } from "../BetterTTV.api";
import { BTTVEmote } from "./BetterTTVEmote";
import { BTTVSet } from "./BetterTTVSet";
import {
  BTTVUserCollection,
  type BetterTTVUserCollection,
} from "./BetterTTVUserCollection";

export function createBTTVUserCollection(
  bttvState: NonNullable<BTTVAsyncState["state"]["value"]>,
  userTwitchUsername: Lowercase<string>,
): BetterTTVUserCollection {
  const setEntries = [
    [
      `BetterTTV ${userTwitchUsername} Channel emotes`,
      bttvState.channelEmotes,
      "channel",
    ],
    [
      `BetterTTV ${userTwitchUsername} Shared emotes`,
      bttvState.sharedEmotes,
      "shared",
    ],
  ] as const;

  // TODO add BTTVUserCollection with third arg => owner
  const owner = {
    avatarUrl: bttvState.avatar,
    id: bttvState.id,
    twitch: { username: userTwitchUsername },
  };

  return new BTTVUserCollection(
    owner,
    setEntries
      .filter(([, emotesList]) => emotesList.length)
      .map(([name, emotes, emoteType]) => {
        return new BTTVSet(
          {
            emotes,
            name,
            // NOTE: here we do not guarantee that id is unique, it is not
            // ChannelEmotes and SharedEmotes will have the same id
            id: bttvState.id,
          },
          (emote) => new BTTVEmote(emote, emoteType),
        );
      }),
  );
}

export function createBTTVUserCollection2(
  user: BetterTTVApiUser & { twitch: { username: Lowercase<string> } },
) {
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
