// /* eslint-disable */

// import {
//   create7TVUserChannelSet,
//   create7TVUserCollection,
//   type I7TVSet,
// } from "..";
// import {
//   get7TVSetById,
//   get7TVUserProfileByTwitchId,
//   type SevenTVApiEmoteSet,
// } from "../SevenTV.api";
// import { SevenTVUserNotFoundError } from "../UserNotFoundError";
// import type { I7TVCollection } from "./SevenTVCollection";
// import {
//   SevenTVCollectionOwner,
//   type I7TVCollectionOwner,
// } from "./SevenTVCollectionOwner";
// import { SevenTVUserCollection } from "./SevenTVUserCollection";

// // sevenTvUserProfile.display_name;
// // sevenTvUserProfile.emote_capacity;
// // sevenTvUserProfile.emote_set;
// // sevenTvUserProfile.emote_set_id;
// // sevenTvUserProfile.id;
// // sevenTvUserProfile.linked_at;
// // sevenTvUserProfile.platform;
// // sevenTvUserProfile.user;
// // sevenTvUserProfile.username;

// // TODO: define function overload types
// // ⚠️

// export interface I7TVUserCollection extends I7TVCollection {
//   owner: I7TVCollectionOwner;
// }

// export class SevenTVPartialUserCollection implements I7TVUserCollection {
//   name;
//   source;
//   updatedAt;
//   owner;
//   sets;

//   constructor(owner: I7TVCollectionOwner, sets: [I7TVSet]) {
//     this.name = `SevenTV ${owner.displayName} Emotes Collection`;
//     this.sets = sets;
//     this.source = "SevenTV" as const;
//     this.updatedAt = Date.now();
//     this.owner = owner;
//   }

//   isReady() {
//     return false;
//   }
// }

// export function make7TVuserCollectionFromPartial() {}

// export async function create7TVUserCollection(
//   sevenTvUser: NonNullable<SevenTVAsyncState["state"]["value"]>,
//   sevenTvUserSet: NonNullable<SevenTVSetAsyncState["state"]["value"]>,
// ): Promise<I7TVUserCollection> {
//   const sevenTVSets = [sevenTvUserSet];

//   return new SevenTVUserCollection(
//     new SevenTVCollectionOwner(sevenTvUser),
//     sevenTVSets,
//   );
// }
