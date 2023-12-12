import type { IEmote } from "~/integrations";

export function findEmotesInPastas(
  pastas: IDBMegaPasta[],
  findEmoteInStorage: (token: IEmote["token"]) => IEmote | undefined,
) {
  return pastas.reduce(
    (pastasWithEmotes, pasta) => {
      const foundEmotes = pasta.validTokens.reduce((foundEmotes, token) => {
        const emote = findEmoteInStorage(token);
        if (emote) {
          foundEmotes.push(emote);
        }
        return foundEmotes;
      }, [] as IEmote[]);
      if (foundEmotes.length) {
        pastasWithEmotes[pasta.id] = foundEmotes;
      }
      return pastasWithEmotes;
    },
    {} as Record<IDBMegaPasta["id"], IEmote[]>,
  );
}
