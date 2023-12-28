import type { IEmote } from "~/integrations";

export function getPastasEmotesMap(
  pastas: IDBMegaPasta[],
  findEmoteInStorage: (token: IEmote["token"]) => IEmote | undefined,
) {
  const pastasEmotesMap = new Map<IDBMegaPasta, IEmote[]>();
  for (const pasta of pastas) {
    const foundEmotes = pasta.validTokens
      .map(findEmoteInStorage)
      .filter(isNotNullish);
    if (foundEmotes.length) {
      pastasEmotesMap.set(pasta, foundEmotes);
    }
  }
  return pastasEmotesMap;
}
