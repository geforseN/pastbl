import { Default, Minimal } from "../shared/types/namespace";
import type * as TPersonEmoteCollection from "../shared/types/namespace";

export interface IPersonsEmoteCollectionsRepository<
  C extends TPersonEmoteCollection.Minimal,
> {
  get(login: TwitchUserLogin): Promise<TPersonEmoteCollection.Default>;
  getRaw(login: TwitchUserLogin): Promise<C>;

  // getAll(): Promise<
  //   TPersonEmoteCollection.Default[] /* TPersonEmoteCollection.SettledIndexedDB[] */
  // >;
  getAllRaw(): Promise<C[] /* TPersonEmoteCollection.SettledIndexedDB[] */>;

  getAllLogins(): Promise<TwitchUserLogin[]>;

  delete(login: TwitchUserLogin): Promise<void>;

  put(
    collection:
      | TPersonEmoteCollection.Default
      | C
      | C
      | C
      | C /* TPersonEmoteCollection.SettledIndexedDB */,
  ): Promise<void>;
}
