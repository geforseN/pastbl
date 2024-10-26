export function defineSevenTVEmoteMaker<T extends string>(type: T) {
  return function (emote: TSevenTV.Api.Emote) {
    const {
      data: { tags, host, listed, animated, flags },
      id,
      name,
      actor_id: actorId,
    } = emote;
    const file = host.files[0];
    assert.ok(file);
    const { width, height } = file;
    return {
      id,
      token: name,
      tags,
      isAnimated: animated,
      isListed: listed,
      isModifier: flags === 256,
      actorId,
      width,
      height,
      source: "SevenTV" as const,
      type,
      url: `https://cdn.7tv.app/emote/${id}/1x.webp` as const,
    };
  };
}
