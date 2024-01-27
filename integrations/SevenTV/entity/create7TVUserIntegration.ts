import type { SevenTVApiUserProfile } from "../SevenTV.api";
import { SevenTVCollectionOwner } from "./SevenTVCollectionOwner";
import {
  SevenTVUserIntegration,
  type ISevenTVUserIntegration,
} from "./SevenTVUserIntegration";
import { create7TVUserChannelSet } from "./create7TVUserChannelSet";

export function create7TVUserIntegration(
  profile: SevenTVApiUserProfile,
): ISevenTVUserIntegration {
  return new SevenTVUserIntegration(new SevenTVCollectionOwner(profile), [
    create7TVUserChannelSet(profile.emote_set),
  ]);
}
