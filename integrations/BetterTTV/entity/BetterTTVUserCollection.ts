import type { BetterTTVSet } from "./BetterTTVSet";
import type { EmoteCollection } from "~/integrations";

export interface BetterTTVUserCollection extends EmoteCollection<BetterTTVSet> {
  source: "BetterTTV";
  owner: {
    avatarUrl: string;
    id: string;
    twitch: {
      username: Lowercase<string>;
    };
  };
}

export class BTTVUserCollection implements BetterTTVUserCollection {
  name;
  sets;
  source;
  updatedAt;
  owner;

  constructor(user: BetterTTVUserCollection["owner"], sets: BetterTTVSet[]) {
    this.name = `BetterTTV ${user.twitch.username} Emotes Collection`;
    this.sets = sets;
    this.source = "BetterTTV" as const;
    this.updatedAt = Date.now();
    this.owner = user;
  }
}
