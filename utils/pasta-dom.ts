import { emojify, has as hasEmoji } from "node-emoji";
import {
  makeEmoteAsStringWithModifiersWrapper,
  makeWrappedEmoteAsString,
  type IEmote,
} from "~/integrations";

export type FindEmoteFn = (token: string) => IEmote | undefined;

export interface CanFindEmote {
  findEmote: FindEmoteFn;
}

function findModifiers(
  tokenIndex: number,
  tokens: string[],
  findEmote: FindEmoteFn,
) {
  const emotes: IEmote[] = [];
  const indexes: number[] = [];
  for (let index = tokenIndex + 1; ; index++) {
    const token = tokens[index];
    if (!token) {
      break;
    }
    const tokenAsEmote = findEmote(token);
    if (!tokenAsEmote || !tokenAsEmote.isModifier) {
      break;
    }
    emotes.push(tokenAsEmote);
    indexes.push(index);
  }
  return {
    emotes,
    indexes,
  };
}

function populateToken(
  this: {
    validTokens: IDBMegaPasta["validTokens"];
    indexesOfPastaTokensToSkip: Set<number>;
    findEmote: FindEmoteFn;
  },
  token: string,
  index: number,
  tokens: string[],
) {
  if (this.indexesOfPastaTokensToSkip.has(index)) {
    return "";
  }
  if (!this.validTokens.includes(token)) {
    return token;
  }
  if (hasEmoji(token)) {
    return `<span data-emoji-token=${token}>${emojify(token)}</span>`;
  }
  const tokenAsEmote = this.findEmote(token);
  if (!tokenAsEmote) {
    return token;
  }
  const modifiers = findModifiers(index, tokens, this.findEmote);
  if (!modifiers.emotes.length) {
    return makeWrappedEmoteAsString(tokenAsEmote);
  }
  for (const index of modifiers.indexes) {
    this.indexesOfPastaTokensToSkip.add(index);
  }
  return makeEmoteAsStringWithModifiersWrapper(tokenAsEmote, modifiers.emotes);
}

export function populatePasta(
  pastaTextContainer: HTMLElement,
  validTokens: IDBMegaPasta["validTokens"],
  findEmote: FindEmoteFn,
) {
  const pastaText = pastaTextContainer.innerText;

  const populatedWords = pastaText.split(" ").map(populateToken, {
    validTokens,
    findEmote,
    indexesOfPastaTokensToSkip: new Set(),
  } satisfies ThisParameterType<typeof populateToken>);

  pastaTextContainer.innerHTML = populatedWords.join(" ");
}
