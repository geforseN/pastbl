import { pastaTextLength } from "~/config/const";

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
    validTokens: makeValidTokensFromPastaText(text),
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

export function getTextStatus(text: MaybeRef<string>) {
  const status = getPastaLengthStatus(toValue(text));
  if (status === "tooLong") {
    return "error";
  }
  if (status === "ok") {
    return "success";
  }
  return "warning";
}

export function makeValidTokensFromPastaText(text: string) {
  return uniqueValues(text.split(" ")).filter(isValidToken);
}

export function createMegaPasta(text: string, tags: string[] = []): MegaPasta {
  return {
    tags,
    text,
    length: text.length,
    createdAt: Date.now(),
    updatedAt: undefined,
    lastCopiedAt: undefined,
    validTokens: makeValidTokensFromPastaText(text),
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

export function isPastasSame(pasta1: IDBMegaPasta, pasta2: IDBMegaPasta) {
  return (
    isPastaTextSame.call(pasta1, pasta2) && isPastaTagsSame.call(pasta1, pasta2)
  );
}

export function makeMegaPasta(text: string, tags: string[] = []): MegaPasta {
  return createMegaPasta(text, tags.slice());
}

export function makeMegaPasta2(basePasta: BasePasta) {
  const trimmedText = megaTrim(basePasta.text);
  const lengthStatus = getPastaLengthStatus(trimmedText);
  if (lengthStatus !== "ok") {
    return Promise.reject(
      createNoLocaleFailureNotification("createPasta__badLength", lengthStatus),
    );
  }
  return Promise.resolve(makeMegaPasta(trimmedText, basePasta.tags));
}
