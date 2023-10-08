export default class SevenTVUser {
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

  // TODO add SevenTVAccounts class for it

  __saveInStorage() {
    //  if (sevenTvAccounts.value.some((account) => account.id === this.id)) {
    //   sevenTvAccounts.value.splice(
    //     sevenTvAccounts.value.findIndex((acc) => acc.id === this.id),
    //     1,
    //   );
    // }
    // sevenTvAccounts.value.push(this.asSaved);
  }

  async fetchAllOwnEmoteSets() {
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
        return new SevenTVEmoteSet(settledEmoteSet, fetchTime);
      });

    return {
      fulfilledEmoteSets,
      rejectedEmoteSets,
    };
  }
}
