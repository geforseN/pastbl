export type FrankerFaceZMappedEmoteSet = Unwrap<
  Omit<FrankerFaceZApi.EmoteSet, "id"> & { id: `${number}` }
>;

export function makeMappedFrankerFaceZEmoteSet(set: FrankerFaceZApi.EmoteSet) {
  return {
    ...set,
    id: set.id.toString(),
  } as FrankerFaceZMappedEmoteSet;
}

function makeFrankerFaceZEmoteRelatedPerson(
  person: FrankerFaceZApi.EmoteRelatedPerson,
) {
  const { name: login } = person;
  assert.ok(isLowercase(login));
  return {
    id: person._id.toString(),
    nickname: person.display_name,
    login,
  };
}

export function makeFrankerFaceZEmote<TT extends TFrankerFaceZ.Emote>(
  emote: FrankerFaceZApi.Emote,
  type: TT["type"],
): TT {
  const id = emote.id.toString();
  assert.ok(isStringifiedNumber(id));
  return {
    id,
    isListed: emote.status === 1,
    isModifier: emote.modifier,
    isWrapper: emote.modifier_flags % 2 === 0,
    token: emote.name,
    url: `//cdn.frankerfacez.com/emote/${emote.id}/1`,
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
