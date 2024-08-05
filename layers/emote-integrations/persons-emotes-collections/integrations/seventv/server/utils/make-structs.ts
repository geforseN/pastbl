import type { SevenTVApi } from "$/emote-integrations/integrations/seventv/server/utils/api-types";
import type { TSevenTV } from "$/emote-integrations/integrations/seventv/server/utils/types";

export function defineSevenTVEmoteSetMaker<T extends string>(type: T) {
  const makeEmote = defineSevenTVEmoteMaker(type);

  return function (set: SevenTVApi.SetWithEmotes) {
    return {
      type,
      name: set.name,
      emotes: set.emotes.map(makeEmote),
      id: set.id,
      capacity: set.capacity,
      source: "SevenTV" as const,
    };
  };
}

export const makeSevenTVChannelSet = defineSevenTVEmoteSetMaker("channel");

export const makePersonSevenTVEmoteIntegration =
  definePersonEmoteIntegrationMaker<TSevenTV.Person.ReadyIntegration>(
    "SevenTV",
  );

export function makeSevenTVEmoteIntegrationOwner(
  profile: SevenTVApi.UserProfile,
) {
  return {
    id: profile.user.id,
    emoteCapacity: profile.emote_capacity,
    linkedAt: profile.linked_at,
    style: profile.user.style,
    pageAddress: `https://7tv.app/users/${profile.user.id}`,
  };
}

function isSevenTVApiSetWithEmotes(
  set: SevenTVApi.SetWithEmotes | SevenTVApi.Set,
): set is SevenTVApi.SetWithEmotes {
  return (set as SevenTVApi.SetWithEmotes).emotes !== undefined;
}

export async function getSevenTVApiUserEmoteSet(profile: SevenTVApi.UserProfile) {
  if (isSevenTVApiSetWithEmotes(profile.emote_set)) {
    return profile.emote_set;
  }
  const set = await fetchSevenTVUserSet(profile.emote_set.id);
  return set;
}
