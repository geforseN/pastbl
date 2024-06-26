import type { EmoteSource, IEmote } from "~/integrations";

class EmoteUrl {
  constructor(public readonly string: string) {}

  // eslint-disable-next-line unicorn/consistent-function-scoping
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

  valueOf() {
    return this.string;
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

  valueOf() {
    return this.value;
  }
}

class EmoteIntegrationLink {
  constructor(readonly emote: EmoteOnHover) {}

  get value() {
    assert.ok(this.canBe());
    return EmoteIntegrationLink.#integrationLinkGetters[this.emote.source](
      this.emote,
    );
  }

  canBe(): this is {
    emote: {
      source: Exclude<EmoteSource, "Twitch">;
    };
  } {
    return this.emote.source !== "Twitch";
  }

  static #integrationLinkGetters = {
    FrankerFaceZ: (emote: EmoteOnHover) =>
      `https://www.frankerfacez.com/emoticon/${emote.id}-${emote.token}`,
    BetterTTV: (emote: EmoteOnHover) =>
      `https://betterttv.com/emotes/${emote.id}`,
    SevenTV: (emote: EmoteOnHover) => `https://7tv.app/emotes/${emote.id}`,
  } as const;
}

export class EmoteOnHover {
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

  integrationLink: EmoteIntegrationLink;

  constructor(
    {
      token,
      source,
      type,
      id,
      isAnimated,
      isListed,
      isModifier,
      isWrapper,
    }: Omit<IEmote, "width" | "height" | "url">,
    {
      width,
      height,
      url,
    }: {
      readonly url: EmoteUrl;
      readonly width: EmoteSize;
      readonly height: EmoteSize;
    },
  ) {
    this.id = id;
    this.url = url;
    this.token = token;
    this.source = source;
    this.width = width;
    this.height = height;
    this.type = type;
    this.isAnimated = isAnimated;
    this.isListed = isListed;
    this.isModifier = isModifier;
    this.isWrapper = isWrapper;
    this.integrationLink = new EmoteIntegrationLink(this);
  }

  static create(emote: IEmote) {
    return new this(emote, {
      url: new EmoteUrl(emote.url),
      width: new EmoteSize(emote.width || 32),
      height: new EmoteSize(emote.height || 32),
    });
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  images = computed(() => {
    return EmoteOnHover.#sizes
      .filter((size) => this.#canHaveSize(size))
      .map((size) => this.#ofSize(size));
  });

  static #sizes = [1, 2, 3, 4] as const;

  #canHaveSize(size: 1 | 2 | 3 | 4) {
    switch (size) {
      case 1:
      case 2: {
        return true;
      }
      case 3: {
        return this.source !== "FrankerFaceZ" && this.source !== "Twitch";
      }
      case 4: {
        return this.source !== "BetterTTV";
      }
      default: {
        raise();
      }
    }
  }

  #ofSize(size: 1 | 2 | 3 | 4) {
    return {
      size,
      src: this.url.withSizeOf(size),
      width: this.width.multiplyBy(size).value,
      height: this.height.multiplyBy(size).value,
      alt: this.token,
    };
  }
}
