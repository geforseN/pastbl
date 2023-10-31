import type { SevenTVApiUserProfile } from "../SevenTV.api";
import { SevenTVCollectionOwner } from "./SevenTVCollectionOwner";
import {
  SevenTVUserCollection,
  type I7TVUserCollection,
} from "./SevenTVUserCollection";
import { create7TVUserChannelSet } from "./create7TVUserChannelSet";

// FIXME remove me i bad
export function create7TVUserCollection(
  sevenTvUser: NonNullable<SevenTVAsyncState["state"]["value"]>,
  sevenTvUserSet: NonNullable<SevenTVSetAsyncState["state"]["value"]>,
): I7TVUserCollection {
  const sevenTVSets = [sevenTvUserSet] satisfies [typeof sevenTvUserSet];

  return new SevenTVUserCollection(
    new SevenTVCollectionOwner(sevenTvUser),
    sevenTVSets,
  );
}

export function create7TVUserCollection2(
  profile: SevenTVApiUserProfile,
): Readonly<I7TVUserCollection> {
  return makeObjectFrozen(
    new SevenTVUserCollection(new SevenTVCollectionOwner(profile), [
      create7TVUserChannelSet(profile.emote_set),
    ]),
  );
}
