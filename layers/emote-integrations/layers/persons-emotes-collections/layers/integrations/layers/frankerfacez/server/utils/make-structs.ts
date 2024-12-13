import consola from "consola";
import { ReadyIntegration } from "../../../../../../../../shared/abstract/types";
import type * as TFrankerFaceZ from "#t_frankerfacez";

export function makeFrankerFaceZEmoteIntegrationOwner(
  profile: TFrankerFaceZ.Api.UserStruct,
): TFrankerFaceZ.Person.IntegrationOwner {
  const { user, badges } = profile;
  if (user.emote_sets.length > 0) {
    consola.warn(
      "FrankerFaceZ API return user with non empty emote_sets array",
      user.emote_sets,
    );
  }
  return {
    id: user.id,
    twitchId: user.twitch_id,
    youtubeId: user.youtube_id,
    avatarUrl: user.avatar,
    isDonor: user.is_donor,
    isSubWoofer: user.is_subwoofer,
    capacity: user.max_emoticons,
    emoteSetsIds: user.emote_sets,
    badges: Object.values(badges).map((badge) => ({
      id: badge.id,
      name: badge.name,
      title: badge.title,
      color: badge.color,
      url: badge.image,
    })),
    pageAddress: `https://www.frankerfacez.com/channel/${profile.user.name}`,
  };
}

function makeFrankerFaceZChannelEmote(emote: TFrankerFaceZ.Api.Emote) {
  return makeFrankerFaceZEmote<TFrankerFaceZ.ChannelEmote>(emote, "channel");
}

export function makeFrankerFaceZChannelSets(
  setsRecord: TFrankerFaceZ.Api.EmoteSetsRecord,
  capacity: number,
): TFrankerFaceZ.ChannelEmoteSet[] {
  return Object.values(setsRecord)
    .map(makeMappedFrankerFaceZEmoteSet)
    .map((set) => {
      return {
        name: set.title,
        id: set.id,
        type: "channel",
        source: "FrankerFaceZ",
        emotes: set.emoticons.map(makeFrankerFaceZChannelEmote),
        capacity,
      };
    });
}

export const makeFrankerFaceZPersonIntegration
  = definePersonEmoteIntegrationMaker<TFrankerFaceZ.Person.ReadyIntegration>(
    "FrankerFaceZ",
  );
