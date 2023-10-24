import { SevenTVCollectionOwner } from "./SevenTVCollectionOwner";
import {
  SevenTVUserCollection,
  type I7TVUserCollection,
} from "./SevenTVUserCollection";

export async function create7TVUserCollection(
  sevenTvUser: NonNullable<SevenTVAsyncState["state"]["value"]>,
  sevenTvUserSet: NonNullable<SevenTVSetAsyncState["state"]["value"]>,
): Promise<I7TVUserCollection> {
  const sevenTVSets = [sevenTvUserSet];

  return new SevenTVUserCollection(
    sevenTVSets,
    new SevenTVCollectionOwner(sevenTvUser),
  );
}
