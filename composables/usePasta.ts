import { emojify, has as isEmoji, find, search } from "node-emoji";
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

export function refreshPasta(
  idbMegaPasta: MaybeRef<IDBMegaPasta>,
  trimmedText: MaybeRef<string> = megaTrim(toValue(idbMegaPasta).text),
): IDBMegaPasta {
  const pasta_ = toValue(idbMegaPasta);
  const text = toValue(trimmedText);
  const pasta = {
    id: pasta_.id,
    createdAt: pasta_.createdAt,
    lastCopiedAt: pasta_.lastCopiedAt,
    text,
    length: pasta_.length,
    tags: [...toRaw(pasta_.tags)],
    validTokens: makeValidTokens(text),
    updatedAt: Date.now(),
  };
  return pasta;
}

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

export function makeRawPasta(pasta: IDBMegaPasta): IDBMegaPasta {
  return {
    ...pasta,
    tags: toRaw([...pasta.tags]),
    validTokens: toRaw([...pasta.validTokens]),
  };
}

export const getPastaLengthStatus = makeLengthStatus(pastaTextLength);
// FIXME: rename 'statusOptions"
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

export function isPastaTextSame(
  this: MaybeRef<{ text: IDBMegaPasta["text"] }>,
  pasta: MaybeRef<IDBMegaPasta>,
) {
  return toValue(pasta).text === toValue(this).text;
}

export function isPastaTagsSame(
  this: MaybeRef<{ tags: IDBMegaPasta["tags"] }>,
  pasta: MaybeRef<IDBMegaPasta>,
) {
  return toValue(pasta).tags.toString() === toValue(this).tags.toString();
}

export function makeMegaPasta(text: string, tags: string[] = []): MegaPasta {
  return createMegaPasta(text, tags.slice());
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

export const getTagLengthStatus = makeLengthStatus(pastaTagLength);

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
        tags.value.length < pastaTagsCount.max,
        new ExtendedError(t(`${m}tooManyTags`, pastaTagsCount), { title }),
      );
      const trimmed = megaTrim(tag);
      const status = getTagLengthStatus(trimmed);
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

// FIXME: watch for app.vue, maybe code duplicate
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
  if (token.startsWith("ffz")) {
  }
  if (isEmoji(token)) {
    return `<span data-emoji-token=${token}>${emojify(token)}</span>`;
  }
  //  const emojis = search(token);
  //  if (emojis.length) {
  //    return emojis
  //      .map((emoji) => `<span data-emoji-token=${token}>${emoji.emoji}</span>`)
  //      .join("");
  //  }
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

class _PastaTime {
  createdAt;
  updatedAt;
  lastCopiedAt;

  constructor(
    megaPastaTime: Pick<
      IDBMegaPasta,
      "createdAt" | "updatedAt" | "lastCopiedAt"
    >,
  ) {
    this.createdAt = megaPastaTime.createdAt;
    this.updatedAt = megaPastaTime.updatedAt;
    this.lastCopiedAt = megaPastaTime.lastCopiedAt;
  }

  asUpdated() {
    return new _PastaTime({
      updatedAt: Date.now(),
      createdAt: this.createdAt,
      lastCopiedAt: this.lastCopiedAt,
    });
  }

  create() {
    return new _PastaTime({
      createdAt: Date.now(),
      updatedAt: undefined,
      lastCopiedAt: undefined,
    });
  }
}

class _PastaText {
  text: string;
  length: number;
  validTokens: string[];

  constructor(
    megaPastaText: Pick<IDBMegaPasta, "text" | "length" | "validTokens">,
  ) {
    this.text = megaPastaText.text;
    this.length = megaPastaText.length;
    this.validTokens = megaPastaText.validTokens;
  }

  asRefreshed(str: string) {
    return new _PastaText({
      text: str,
      length: str.length,
      validTokens: makeValidTokens(str),
    });
  }
}

class _PastaTags {
  tags: string[];

  constructor(megaPasta: Pick<IDBMegaPasta, "tags">) {
    this.tags = megaPasta.tags;
  }

  get clone() {
    return new _PastaTags({ tags: [...toRaw(this.tags)] });
  }
}

class _Pasta {
  id: number;
  text: _PastaText;
  tags: _PastaTags;
  time: _PastaTime;

  constructor(megaPasta: IDBMegaPasta) {
    this.id = megaPasta.id;
    this.text = new _PastaText(megaPasta);
    this.tags = new _PastaTags(megaPasta);
    this.time = new _PastaTime(megaPasta);
  }

  asRefreshed(text: string) {
    return new _Pasta({
      id: this.id,
      ...this.tags.clone,
      ...this.time.asUpdated(),
      ...this.text.asRefreshed(text),
    });
  }
}
