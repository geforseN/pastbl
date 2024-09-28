export const makePersonBetterTTVEmoteIntegration
  = definePersonEmoteIntegrationMaker<TBetterTTV.Person.ReadyIntegration>(
    "BetterTTV",
  );

export function makeBetterTTVEmoteIntegrationOwner(
  bttv: TBetterTTV.Api.User,
  twitch: PersonTwitch,
): TBetterTTV.Person.IntegrationOwner {
  return {
    avatarUrl: bttv.avatar,
    id: bttv.id,
    twitch,
    pageAddress: `https://betterttv.com/users/${bttv.id}`,
  };
}

function makeBetterTTVChannelEmote(
  emote: TBetterTTV.Api.ChannelEmote,
): TBetterTTV.Person.ChannelEmote {
  return makeBetterTTVEmote(emote, {
    type: "channel",
    isModifier: false,
    isListed: true,
    isWrapper: false,
  });
}

export const makeBetterTTVChannelSet = defineBetterTTVSetMaker(
  "Channel emotes",
  "channel",
  makeBetterTTVChannelEmote,
);

function makeBetterTTVSharedEmote(
  emote: TBetterTTV.Api.SharedEmote,
): TBetterTTV.Person.SharedEmote {
  return makeBetterTTVEmote(emote, {
    type: "shared",
    isModifier: false,
    isListed: true,
    isWrapper: false,
    codeOrigin: emote.codeOriginal,
    userId: emote.user.id,
  });
}

export const makeBetterTTVSharedSet = defineBetterTTVSetMaker(
  "Shared emotes",
  "shared",
  makeBetterTTVSharedEmote,
);
