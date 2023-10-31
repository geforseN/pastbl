import type { SevenTVApiUserProfile } from "../SevenTV.api";
import { SevenTVCollectionOwner } from "./SevenTVCollectionOwner";
import {
  SevenTVUserCollection,
  type I7TVUserCollection,
} from "./SevenTVUserCollection";
import { create7TVUserChannelSet } from "./create7TVUserChannelSet";

export function create7TVUserCollection(
  profile: SevenTVApiUserProfile,
): Readonly<I7TVUserCollection> {
  return makeObjectFrozen(
    new SevenTVUserCollection(new SevenTVCollectionOwner(profile), [
      create7TVUserChannelSet(profile.emote_set),
    ]),
  );
}
