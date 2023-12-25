import type { getFFZProfileByTwitchUsername } from "../FrankerFaceZ.api";
import { FFZCollectionOwner } from "./FrankerFaceZCollectionOwner";
import {
  FFZPartialUserIntegration,
  type FrankerFaceZPartialUserIntegration,
} from "./FrankerFaceZPartialUserIntegration";
import { FFZUserBadge } from "./FrankerFaceZUserBadge";

export function createFFZPartialUserIntegration(
  profile: Awaited<ReturnType<typeof getFFZProfileByTwitchUsername>>,
): FrankerFaceZPartialUserIntegration {
  return new FFZPartialUserIntegration(
    new FFZCollectionOwner(
      profile.user,
      Object.values(profile.badges).map((badge) => new FFZUserBadge(badge)),
    ),
    profile.user.max_emoticons,
  );
}
