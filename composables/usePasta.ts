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

export const pastaTextLength = {
  max: 1984,
  min: 1,
} as const;

export const statusOptions = {
  ...pastaTextLength,
  warning: 500,
} as const;

export function getTextStatus(text: MaybeRef<string>) {
  const { length } = toValue(text);
  if (length < statusOptions.min || length > statusOptions.max) {
    return "error";
  }
  if (length > statusOptions.warning) {
    return "warning";
  }
  return "success";
}

export function makeValidTokens(text: string) {
  return [...new Set(text.split(" "))].filter(isValidToken);
}

export function createMegaPasta(text: string, tags: string[] = []): MegaPasta {
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

export const usePasta = (params: UsePastaStateParam = {}) => {
  const { tag = ref(""), tags = ref([] as string[]), text = ref("") } = params;

  const { addTag, removeTag, removeAllTags } = usePastaTags(tags);

  function reset() {
    tag.value = "";
    tags.value = [];
    text.value = "";
  }

  reset();

  return {
    tag,
    tags,
    text,
    reset,
    removeTag,
    removeAllTags,
    addTag,
    addOwnTag() {
      return this.addTag(toValue(tag));
    },
  };
};

export const pastaTagLength = {
  min: 1,
  max: 80,
} as const;

export const maxTagsInPasta = 15;

const pastaTagsCount = { max: maxTagsInPasta } as const;

export function getTagStatus(tag: string) {
  return getLengthStatus(tag.length, pastaTagLength);
}

function usePastaTags(tags: Ref<string[]>) {
  const { t } = useI18n();

  return {
    removeTag(tag: string) {
      const m = "toast.removeTag.fail.";
      tags.value = withRemoved(
        tags,
        tag,
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
      const title = t(`${m}title`);
      assert.ok(
        tags.value.length < maxTagsInPasta,
        new ExtendedError(t(`${m}tooManyTags`, pastaTagsCount), { title }),
      );
      const trimmed = megaTrim(tag);
      const status = getTagStatus(trimmed);
      assert.ok(
        status === "ok",
        new ExtendedError(t(`${m}${status}Message`, pastaTagLength), { title }),
      );
      assert.ok(
        !tags.value.includes(trimmed),
        new ExtendedError(t(`${m}sameMessage`), { title }),
      );
      const final = trimmed.startsWith("@") ? toLowerCase(trimmed) : trimmed;
      tags.value.push(final);
    },
  };
}

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
    return `<span class="emoji">${emojify(token)}</span>`;
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
