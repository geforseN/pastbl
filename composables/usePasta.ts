export type BasePasta = {
  text: string;
  tags: string[];
};

export type MegaPasta = BasePasta & {
  length: number;
  createdAt: number;
  populatedText?: string;
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
  for (const char of word) {
    if (!isValidASCIICharCode(char.charCodeAt(0))) {
      return false;
    }
  }
  return true;
}

function isValidToken2(word: string) {
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
    tags: toRaw(tags),
    text: trimmedText,
    length: trimmedText.length,
    createdAt: Date.now(),
    validTokens: [...new Set(trimmedText.split(" "))].filter(isValidToken),
    lastCopiedAt: undefined,
    populatedText: undefined,
  };
}

export const usePasta = () => {
  const tag = ref("");
  const tags = ref<string[]>([]);
  const text = ref("");

  return {
    tag,
    tags,
    text,
    $reset() {
      tag.value = "";
      tags.value = [];
      text.value = "";
    },
    removeTag: (tag: string) => {
      const index = tags.value.indexOf(tag);
      assert.ok(
        index >= 0,
        new ExtendedError("Can not remove the tag which is not in tags"),
      );
      tags.value.splice(index, 1);
    },
    removeAllTags: () => {
      tags.value = [];
    },
    addTag: (tag: string) => {
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
