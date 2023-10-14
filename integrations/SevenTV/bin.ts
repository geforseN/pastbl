export class SevenTVUser {
  id: string;
  avatarUrl: string;
  createdAt: number;
  emoteSets: SevenTvUserBasicEmoteSet[];
  displayName: string;
  username: string;

  constructor(streamerProfile: any) {
    this.id = streamerProfile.id;
    this.avatarUrl = streamerProfile.avatar_url;
    this.createdAt = streamerProfile.created_at;
    this.emoteSets = streamerProfile.emote_sets.map(
      (set: SevenTvUserBasicEmoteSet) => ({
        id: set.id,
        name: set.name,
        capacity: set.capacity,
      }),
    );
    this.displayName = streamerProfile.display_name;
    this.username = streamerProfile.username;
  }

  get asSaved(): Stored7TvUser {
    return {
      ...this,
      fetchTime: Date.now(),
    };
  }

  async fetchAllOwnEmoteCollections() {
    const settledEmoteSets = await Promise.allSettled(
      this.emoteSets
        .map((set) => `https://7tv.io/v3/emote-sets/${set.id}`)
        .map((url) => fetch(url).then((response) => response.json())),
    );

    const fetchTime = Date.now();

    const rejectedEmoteSets = settledEmoteSets.filter(
      (emoteSet): emoteSet is PromiseRejectedResult =>
        emoteSet.status === "rejected",
    );

    const fulfilledEmoteSets = settledEmoteSets
      .filter(
        (
          emotes,
        ): emotes is PromiseFulfilledResult<_SevenTvUserExtendedEmoteSet> =>
          emotes.status === "fulfilled",
      )
      .map((settledEmoteSet) => {
        console.log(settledEmoteSet);
        return new SevenTVEmoteSet(settledEmoteSet, fetchTime);
      });

    return {
      fulfilledEmoteSets,
      rejectedEmoteSets,
    };
  }
}

export class SevenTVEmoteSet {
  fetchTime;
  id;
  name;
  emoteCount;
  capacity;
  emotes: SevenTvEmote[];

  constructor(
    settledEmoteSet: PromiseFulfilledResult<_SevenTvUserExtendedEmoteSet>,
    fetchTime: number,
  ) {
    this.fetchTime = fetchTime;
    this.id = settledEmoteSet.value.id;
    this.name = settledEmoteSet.value.name;
    this.emoteCount = settledEmoteSet.value.emote_count;
    this.capacity = settledEmoteSet.value.capacity;
    this.emotes = (settledEmoteSet.value.emotes ?? []).map(
      (emote: _SevenTvEmote) => {
        return {
          id: emote.id,
          chatName: emote.name,
          originalName:
            emote.name === emote.data.name ? undefined : emote.data.name,
          url: emote.data.host.url,
          isPubliclyListed: emote.data.listed,
          isAnimated: emote.data.animated,
          state: emote.data.state,
          tags: emote.data.tags,
        };
      },
    );
  }
}

export const halloweenGlobalEmotesSetId = "63237427e062d588b69f84d0";

export type SevenTvUserBasicEmoteSet = {
  id: string;
  name: string;
  capacity: number;
};

export type Stored7TvUser = {
  id: string;
  avatarUrl: string;
  createdAt: number;
  emoteSets: SevenTvUserBasicEmoteSet[];
  displayName: string;
  username: string;
  fetchTime: number;
};

export type SevenTvEmote = {
  id: string;
  chatName: string;
  originalName?: string;
  url: string;
  isPubliclyListed: boolean;
  isAnimated: boolean;
  state: ("NO_PERSONAL" | "LISTED" | "PERSONAL")[];
  tags: string[];
};

// import { parse, stringify } from "zipson";

// const uzySevenTvId = "623dec3a1aeb248de84964bf";
// const uzyFirstEmoteSetId = "623dec3a1aeb248de84964bf";

// export async function getFirstUzyEmoteSet() {
//   const uzyFirstSetFromLocalStorage = parse(
//     localStorage.getItem(`7tv::emote-sets::${uzyFirstEmoteSetId}`) || "",
//   ) as SevenTVEmoteSet | "";

//   if (uzyFirstSetFromLocalStorage) {
//     console.log(uzyFirstSetFromLocalStorage);
//     console.log("getFirstUzyEmoteSet: return value from localStorage");
//     return uzyFirstSetFromLocalStorage;
//   }
//   const sevenTV = new SevenTV();
//   const uzy = await sevenTV.fetchUserById(uzySevenTvId);
//   const uzyEmoteSets = await uzy.fetchAllOwnEmoteSets();
//   // FIXME: make func or method for below foreach
//   uzyEmoteSets.fulfilledEmoteSets.forEach((emoteSet) => {
//     localStorage.setItem(
//       `7tv::emote-sets::${emoteSet.id}`,
//       stringify(emoteSet),
//     );
//   });
//   const firstUzySet = uzyEmoteSets.fulfilledEmoteSets.find(
//     (set) => set.id === uzyFirstEmoteSetId,
//   );
//   if (!firstUzySet) {
//     throw new Error();
//   }
//   console.log("getFirstUzyEmoteSet: return value from fetch");
//   return firstUzySet;
// }
