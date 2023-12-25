import type { SevenTVApiUserProfile } from "../SevenTV.api";
import { SevenTVCollectionOwner } from "./SevenTVCollectionOwner";
import {
  SevenTVUserIntegration,
  type I7TVUserCollection,
} from "./SevenTVUserIntegration";
import { create7TVUserChannelSet } from "./create7TVUserChannelSet";

export function create7TVUserIntegration(
  profile: SevenTVApiUserProfile,
): Readonly<I7TVUserCollection> {
  return makeObjectFrozen(
    new SevenTVUserIntegration(new SevenTVCollectionOwner(profile), [
      create7TVUserChannelSet(profile.emote_set),
    ]),
  );
}
