import type { IBetterTTVSet } from "./BetterTTVSet";
import type { InternalUserEmoteIntegration } from "~/integrations";

export interface BetterTTVUserIntegration
  extends InternalUserEmoteIntegration<
    "BetterTTV",
    IBetterTTVSet,
    {
      avatarUrl: string;
      id: string;
      twitch: {
        login: Lowercase<string>;
      };
    }
  > {}

export class BTTVUserIntegration implements BetterTTVUserIntegration {
  name;
  sets;
  owner;
  source = "BetterTTV" as const;
  updatedAt = Date.now();

  constructor(user: BetterTTVUserIntegration["owner"], sets: IBetterTTVSet[]) {
    this.name = `BetterTTV ${user.twitch.login} Emotes Collection`;
    this.sets = sets;
    this.owner = user;
  }
}
