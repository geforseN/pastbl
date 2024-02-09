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
  updatedAt?: number;
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

export function trimPastaText(text: string) {
  return text
    .trim()
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word.length)
    .join(" ");
}

export function makeValidTokens(text: string) {
  return [...new Set(text.split(" "))].filter(isValidToken);
}

export function createMegaPasta(text: string, tags: string[]): MegaPasta {
  return {
    tags,
    text,
    length: text.length,
    createdAt: Date.now(),
    updatedAt: undefined,
    lastCopiedAt: undefined,
    validTokens: makeValidTokens(text),
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
  const { t } = useI18n();
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
      const m = "toast.removeTag.fail.";
      tags.value = withRemoved(
        tags.value,
        (tag_) => tag_ === tag,
        new ExtendedError(t(m + "noExistMessage"), {
          title: t(m + "title"),
        }),
      );
    },
    removeAllTags() {
      tags.value = [];
    },
    addTag(tag: string) {
      const m = "toast.addTag.fail.";
      assert.ok(
        tag.length,
        new ExtendedError(t(m + "emptyInputMessage"), {
          title: t(m + "title"),
        }),
      );
      assert.ok(
        !tags.value.includes(tag),
        new ExtendedError(t(m + "sameInputMessage"), {
          title: t(m + "title"),
        }),
      );
      tags.value.push(tag);
    },
  };
};

function findModifiers(
  tokenIndex: number,
  tokens: string[],
  emotesStore: ReturnType<typeof useEmotesStore>,
) {
  const emotes: IEmote[] = [];
  const indexes: number[] = [];
  for (let index = tokenIndex + 1; ; index++) {
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
  return {
    emotes,
    indexes,
  };
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

  const populatedWords = pastaText.split(" ").map(populateToken, {
    pasta,
    emotesStore,
    indexesOfPastaTokensToSkip: new Set(),
  } satisfies ThisParameterType<typeof populateToken>);

  pastaTextContainer.innerHTML = populatedWords.join(" ");
}
