import type { getFFZProfileByTwitchUsername } from "../FrankerFaceZ.api";
import { FFZCollectionOwner } from "./FrankerFaceZCollectionOwner";
import { FFZPartialUserCollection } from "./FrankerFaceZPartialUserCollection";
import { FFZUserBadge } from "./FrankerFaceZUserBadge";

export function createFFZPartialUserCollection(
  profile: Awaited<ReturnType<typeof getFFZProfileByTwitchUsername>>,
) {
  return new FFZPartialUserCollection(
    new FFZCollectionOwner(
      profile.user,
      Object.values(profile.badges).map((badge) => new FFZUserBadge(badge)),
    ),
    profile.user.max_emoticons,
  );
}
