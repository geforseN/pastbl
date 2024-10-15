import { emojify, has as hasEmoji } from "node-emoji";
import { assert } from "~/utils/assert.ts";

export interface FindEmote {
  (token: string): IEmote | undefined;
}

export interface CanFindEmote {
  findEmote: FindEmote;
}

function findModifiers(
  tokenIndex: number,
  tokens: string[],
  findEmote: FindEmote,
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
    validTokens: OmegaPasta["validTokens"];
    indexesOfPastaTokensToSkip: Set<number>;
    findEmote: FindEmote;
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
  if (modifiers.emotes.length === 0) {
    return makeWrappedEmoteAsString(tokenAsEmote);
  }
  for (const index of modifiers.indexes) {
    this.indexesOfPastaTokensToSkip.add(index);
  }
  return makeEmoteAsStringWithModifiersWrapper(tokenAsEmote, modifiers.emotes);
}

export function populatePasta(
  pastaTextContainer: HTMLElement,
  validTokens: OmegaPasta["validTokens"],
  findEmote: FindEmote,
) {
  const pastaText = pastaTextContainer.textContent;
  assert.ok(pastaText);
  const populatedWords = pastaText.split(" ").map(
    populateToken.bind({
      validTokens,
      findEmote,
      indexesOfPastaTokensToSkip: new Set<number>(),
    }),
  );
  pastaTextContainer.innerHTML = populatedWords.join(" ");
}
