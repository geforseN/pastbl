import type { BetterTTVSet } from "./BetterTTVSet";
import type { InternalUserEmoteIntegration } from "~/integrations";

export interface BetterTTVUserIntegration
  extends InternalUserEmoteIntegration<
    "BetterTTV",
    BetterTTVSet,
    {
      avatarUrl: string;
      id: string;
      twitch: {
        username: Lowercase<string>;
      };
    }
  > {}

export class BTTVUserIntegration implements BetterTTVUserIntegration {
  name;
  sets;
  source;
  updatedAt;
  owner;

  constructor(user: BetterTTVUserIntegration["owner"], sets: BetterTTVSet[]) {
    this.name = `BetterTTV ${user.twitch.username} Emotes Collection`;
    this.sets = sets;
    this.source = "BetterTTV" as const;
    this.updatedAt = Date.now();
    this.owner = user;
  }
}
