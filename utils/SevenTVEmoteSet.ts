import type { SevenTvEmote, _SevenTvUserExtendedEmoteSet } from "#imports";

export default class SevenTVEmoteSet {
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
