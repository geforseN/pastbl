import { pastasConfig } from "$/pastas/app.config";

export type PastaText = string;

export type PastaTag = string;

export type PastaTags = PastaTag[];

export type BasePasta = {
  text: PastaText;
  tags: PastaTags;
};

export type MegaPasta = BasePasta & {
  length: number;
  createdAt: number;
  updatedAt?: number;
  lastCopiedAt?: number;
  validTokens: string[];
};

export type OmegaPasta = MegaPasta & {
  id: number;
};

export type OmegaPastaId /* TODO: add brand */ = OmegaPasta["id"];

export function refreshPasta(
  omegaPasta: MaybeRef<OmegaPasta>,
  trimmedText: MaybeRef<string> = megaTrim(toValue(omegaPasta).text),
): OmegaPasta {
  const pasta_ = toValue(omegaPasta);
  const text = toValue(trimmedText);
  const pasta = {
    id: pasta_.id,
    createdAt: pasta_.createdAt,
    lastCopiedAt: pasta_.lastCopiedAt,
    text,
    length: pasta_.length,
    tags: [...toRaw(pasta_.tags)],
    validTokens: makeValidPastaTokens(text),
    updatedAt: Date.now(),
  };
  return pasta;
}

// LINK: http://facweb.cs.depaul.edu/sjost/it212/documents/ascii-pr.htm
// NOTE: SPACE and DELETE is not included (SPACE === 32, DELETE === 127)
// PROBABLY can drop more code points, but no idea which characters are valid for emote name
function isValidASCIICodePoint(charCode: number) {
  return charCode > 32 && charCode < 127;
}

function isValidToken(word: string) {
  for (let index = 0; index < word.length; index++) {
    const codePoint = word.codePointAt(index);
    if (codePoint && !isValidASCIICodePoint(codePoint)) {
      return false;
    }
  }
  return true;
}

export function makeRawPasta(pasta: OmegaPasta): OmegaPasta {
  return {
    ...pasta,
    tags: toRaw([...pasta.tags]),
    validTokens: toRaw([...pasta.validTokens]),
  };
}

const _getPastaTextLengthStatus = makeLengthStatusGetter(
  pastasConfig.pastaText.length,
);

export function getTextStatus(text: MaybeRef<string>) {
  const status = _getPastaTextLengthStatus(toValue(text));
  if (status === "warning") {
    return "warning";
  }
  if (status === "ok") {
    return "success";
  }
  return "error";
}

export function makeValidPastaTokens(text: string) {
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
    validTokens: makeValidPastaTokens(text),
  };
}

export function isPastaTextSame(
  this: MaybeRef<{ text: OmegaPasta["text"] }>,
  pasta: MaybeRef<OmegaPasta>,
) {
  return toValue(pasta).text === toValue(this).text;
}

export function isPastaTagsSame(
  this: MaybeRef<{ tags: OmegaPasta["tags"] }>,
  pasta: MaybeRef<OmegaPasta>,
) {
  return toValue(pasta).tags.toString() === toValue(this).tags.toString();
}

export function isPastasSame(pasta1: OmegaPasta, pasta2: OmegaPasta) {
  return (
    isPastaTextSame.call(pasta1, pasta2) && isPastaTagsSame.call(pasta1, pasta2)
  );
}

export function makeMegaPasta(text: string, tags: string[] = []): MegaPasta {
  return createMegaPasta(text, [...tags]);
}

export async function makeMegaPasta2(basePasta: BasePasta) {
  const trimmedText = megaTrim(basePasta.text);
  const lengthStatus = _getPastaTextLengthStatus(trimmedText);
  if (lengthStatus !== "ok" && lengthStatus !== "warning") {
    throw new BadPastaTextLengthError(lengthStatus);
  }
  return makeMegaPasta(trimmedText, basePasta.tags);
}
