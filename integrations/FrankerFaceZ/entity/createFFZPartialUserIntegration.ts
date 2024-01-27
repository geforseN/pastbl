import type { getFFZUserByTwitchLogin } from "../FrankerFaceZ.api";
import { FFZCollectionOwner } from "./FrankerFaceZCollectionOwner";
import {
  FFZPartialUserIntegration,
  type FrankerFaceZPartialUserIntegration,
} from "./FrankerFaceZPartialUserIntegration";
import { FFZUserBadge } from "./FrankerFaceZUserBadge";

export function createFFZPartialUserIntegration(
  user: Awaited<ReturnType<typeof getFFZUserByTwitchLogin>>,
): FrankerFaceZPartialUserIntegration {
  return new FFZPartialUserIntegration(
    new FFZCollectionOwner(
      user.user,
      Object.values(user.badges).map((badge) => new FFZUserBadge(badge)),
    ),
    user.user.max_emoticons,
  );
}
