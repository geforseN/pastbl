import type { EmoteSource, IEmote } from "~/integrations";

class EmoteUrl {
  // eslint-disable-next-line no-useless-constructor
  constructor(public readonly string: string) {}

  #tuple = computed(() => {
    const url = this.string;
    if (!url) {
      return;
    }
    const sizeStartIndex = url.lastIndexOf("/");
    assert.ok(sizeStartIndex !== -1);
    return [url.slice(0, sizeStartIndex), url.slice(sizeStartIndex)] as const;
  });

  withSizeOf(size: 1 | 2 | 3 | 4) {
    if (size === 1) {
      return this.string;
    }
    assert.ok(this.#tuple.value);
    const [start, end] = this.#tuple.value;
    return start + end.replace("1", String(size));
  }
}

class EmoteSize {
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  multiplyBy(integer: number) {
    assert.ok(Number.isInteger(integer));
    return new EmoteSize(this.value * integer);
  }
}

export class Emote {
  readonly id: string;
  readonly token: string;
  readonly url: EmoteUrl;
  readonly source: EmoteSource;
  readonly width: EmoteSize;
  readonly height: EmoteSize;
  readonly type: string;

  readonly isAnimated;
  readonly isListed;
  readonly isModifier;
  readonly isWrapper;

  constructor({
    url,
    token,
    source,
    width = 32,
    height = 32,
    type,
    id,
    isAnimated,
    isListed,
    isModifier,
    isWrapper,
  }: IEmote) {
    this.id = id;
    this.url = new EmoteUrl(url);
    this.token = token;
    this.source = source;
    this.width = new EmoteSize(width);
    this.height = new EmoteSize(height);
    // assert.ok(typeof type === "string");
    this.type = type;
    this.isAnimated = isAnimated;
    this.isListed = isListed;
    this.isModifier = isModifier;
    this.isWrapper = isWrapper;
  }

  canHaveSize(size: 1 | 2 | 3 | 4) {
    switch (size) {
      case 3:
        return !["FrankerFaceZ", "Twitch"].includes(this.source);
      case 4:
        return this.source !== "BetterTTV";
      default:
        return true;
    }
  }
}

// TODO: add to git and then remove it form git
// const width = computed(() => emote.value?.width || 32);
// const height = computed(() =>
//   emote.value?.height
//     ? emote.value?.height
//     : emote.value?.width
//       ? undefined
//       : 32,
// );
