import { consola } from "consola";
import type { SevenTVApi } from "./api-types";

export function defineSevenTVEmoteMaker(type: string) {
  return function (emote: SevenTVApi.Emote) {
    const {
      data: { tags, host, listed, animated },
      id,
      flags,
      name,
      actor_id: actorId,
    } = emote;
    const file = host.files[1];
    assert.ok(file);
    const { width, height } = file;
    return {
      id,
      token: name,
      tags,
      isAnimated: animated,
      isListed: listed,
      isModifier: flags !== 0,
      isWrapper: flags === 1,
      actorId,
      width,
      height,
      source: "SevenTV" as const,
      type,
      url: `https://cdn.7tv.app/emote/${id}/1x.webp` as const,
    };
  };
}
