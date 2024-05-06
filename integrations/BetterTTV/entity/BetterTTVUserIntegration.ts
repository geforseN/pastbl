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
        login: TwitchUserLogin;
      };
    }
  > {}

export class BTTVUserIntegration implements BetterTTVUserIntegration {
  name;
  sets;
  owner;
  source = "BetterTTV" as const;
  formedAt = Date.now();

  constructor(user: BetterTTVUserIntegration["owner"], sets: IBetterTTVSet[]) {
    this.name = `${user.twitch.login} Emotes`;
    this.sets = sets;
    this.owner = user;
  }
}
