import type { I7TVSet } from "./SevenTVSet";
import {
  SevenTVUserIntegration,
  type ISevenTVUserIntegration,
} from "./SevenTVUserIntegration";

export function recreate7TVUserIntegration(
  collection: Readonly<ISevenTVUserIntegration>,
  sets: [Readonly<I7TVSet>],
) {
  return new SevenTVUserIntegration(collection.owner, sets);
}
