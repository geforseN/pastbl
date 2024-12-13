import { isStringifiedNumber } from "../../../../../../../app/utils/guards";
import { isLowercase } from "../../../../../../../app/utils/string";
import { assert } from "../../../../../../../app/utils/assert";
import type { Unwrap } from "../../../../../../../app/utils/types";
import type * as TFrankerFaceZ from "#t_frankerfacez";

export type FrankerFaceZMappedEmoteSet = Unwrap<
  Omit<TFrankerFaceZ.Api.EmoteSet, "id"> & { id: `${number}` }
>;

export function makeMappedFrankerFaceZEmoteSet(
  set: TFrankerFaceZ.Api.EmoteSet,
) {
  return {
    ...set,
    id: set.id.toString(),
  } as FrankerFaceZMappedEmoteSet;
}

function makeFrankerFaceZEmoteRelatedPerson(
  person: TFrankerFaceZ.Api.EmoteRelatedPerson,
) {
  const { name: login } = person;
  assert.ok(isLowercase(login));
  return {
    id: person._id.toString(),
    nickname: person.display_name,
    login,
  };
}

export function makeFrankerFaceZEmote<E extends TFrankerFaceZ.Emote>(
  emote: TFrankerFaceZ.Api.Emote,
  type: E["type"],
): E {
  const id = emote.id.toString();
  assert.ok(isStringifiedNumber(id));

  const isAnimated = "animated" in emote && Boolean(emote.animated);

  let url = `//cdn.frankerfacez.com/emote/${id}/`;
  if (isAnimated) {
    url += "animated/";
  }
  url += "1";

  return {
    id,
    isAnimated,
    isListed: emote.status === 1,
    isModifier: emote.modifier,
    token: emote.name,
    url,
    width: emote.width,
    height: emote.height,
    source: "FrankerFaceZ",
    owner:
      emote.owner === null
        ? undefined
        : makeFrankerFaceZEmoteRelatedPerson(emote.owner),
    artist:
      emote.artist === null
        ? undefined
        : makeFrankerFaceZEmoteRelatedPerson(emote.artist),
    type,
  };
}
