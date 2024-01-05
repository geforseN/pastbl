import { emojify, has as isEmoji } from "node-emoji";
import {
  makeWrappedEmoteAsString,
  makeEmoteAsStringWithModifiersWrapper,
  type IEmote,
} from "~/integrations";

export type BasePasta = {
  text: string;
  tags: string[];
};

export type MegaPasta = BasePasta & {
  length: number;
  createdAt: number;
  lastCopiedAt?: number;
  validTokens: string[];
};

export type IDBMegaPasta = MegaPasta & {
  id: number;
};

// LINK: http://facweb.cs.depaul.edu/sjost/it212/documents/ascii-pr.htm
// NOTE: SPACE and DELETE is not included (SPACE === 32, DELETE === 127)
// PROBABLY can drop more charCodes, but no idea which characters are valid for emote name
function isValidASCIICharCode(charCode: number) {
  return charCode > 32 && charCode < 127;
}

function isValidToken(word: string) {
  for (let i = 0; i < word.length; i++) {
    if (!isValidASCIICharCode(word.charCodeAt(i))) {
      return false;
    }
  }
  return true;
}

export function createMegaPasta(
  trimmedText: BasePasta["text"],
  tags: BasePasta["tags"],
): MegaPasta {
  return {
    tags: isShallow(tags) ? toRaw(tags) : tags,
    text: trimmedText,
    length: trimmedText.length,
    createdAt: Date.now(),
    validTokens: [...new Set(trimmedText.split(" "))].filter(isValidToken),
    lastCopiedAt: undefined,
  };
}

type UsePastaStateParam = {
  tag?: Ref<string>;
  tags?: Ref<string[]>;
  text?: Ref<string>;
};

export const usePasta = ({
  tag = ref(""),
  tags = ref([]),
  text = ref(""),
}: UsePastaStateParam = {}) => {
  return {
    tag,
    tags,
    text,
    reset() {
      tag.value = "";
      tags.value = [];
      text.value = "";
    },
    removeTag(tag: string) {
      const index = tags.value.indexOf(tag);
      assert.ok(
        index >= 0,
        new ExtendedError("Can not remove the tag which is not in tags"),
      );
      tags.value.splice(index, 1);
    },
    removeAllTags() {
      tags.value = [];
    },
    addTag(tag: string) {
      assert.ok(
        tag.length,
        new ExtendedError("Can not add the empty tag", {
          title: "Pasta tag was not added",
        }),
      );
      assert.ok(
        !tags.value.includes(tag),
        new ExtendedError("The tag were already added to pasta", {
          title: "Pasta tag was not added",
        }),
      );
      tags.value.push(tag);
    },
  };
};

function findModifiers(
  emoteIndex: number,
  tokens: string[],
  emotesStore: ReturnType<typeof useEmotesStore>,
) {
  const emotes: IEmote[] = [];
  const indexes: number[] = [];
  for (let index = emoteIndex + 1; true; index++) {
    const token = tokens[index];
    if (!token) {
      break;
    }
    const tokenAsEmote = emotesStore.findEmote(token);
    if (!tokenAsEmote || !tokenAsEmote.isModifier) {
      break;
    }
    emotes.push(tokenAsEmote);
    indexes.push(index);
  }
  return { emotes, indexes };
}

function populateToken(
  this: {
    pasta: IDBMegaPasta;
    indexesOfPastaTokensToSkip: Set<number>;
    emotesStore: ReturnType<typeof useEmotesStore>;
  },
  token: string,
  index: number,
  tokens: string[],
) {
  if (this.indexesOfPastaTokensToSkip.has(index)) {
    return "";
  }
  if (!this.pasta.validTokens.includes(token)) {
    return token;
  }
  if (isEmoji(token)) {
    return emojify(token);
  }
  const tokenAsEmote = this.emotesStore.findEmote(token);
  if (!tokenAsEmote) {
    return token;
  }
  const modifiers = findModifiers(index, tokens, this.emotesStore);
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
  pasta: IDBMegaPasta,
  emotesStore: ReturnType<typeof useEmotesStore>,
) {
  const pastaText = pastaTextContainer.innerText;

  // TODO: await emotesStore here until user emotes are not loaded
  // OR no need to await here, but when new emotes are loaded SHOULD repopulate visible pastas

  const populatedWords = pastaText.split(" ").map(populateToken, {
    pasta,
    emotesStore,
    indexesOfPastaTokensToSkip: new Set(),
  } satisfies ThisParameterType<typeof populateToken>);

  pastaTextContainer.innerHTML = populatedWords.join(" ");
}
