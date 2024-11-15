export function injectEmoteOnHover() {
  return (
    inject<ReturnType<typeof useExtendedEmoteOnHover>>("emoteOnHover")
    || raise()
  );
}

export function useExtendedEmoteOnHover(container: ComputedRef<HTMLElement>) {
  const emoteOnHover = useEmoteOnHover(container);
  const emotesStore = useEmotesStore();

  return {
    ...emoteOnHover,
    allEmotesHandler: emoteOnHover.makeMouseoverHandler({
      findEmote(target) {
        const token = getEmoteToken(target);
        return emotesStore.findEmote(token);
      },
      findEmoteModifiersByTokens(tokens) {
        assert.ok(tokens.length);
        const emotes = tokens.map(emotesStore.findEmote).filter(isNotNullable);
        assert.ok(tokens.length === emotes.length);
        return emotes;
      },
    }),
    globalEmotesHandler: emoteOnHover.makeMouseoverHandler({
      findEmote(target) {
        const token = getEmoteToken(target);
        return emotesStore.findGlobalEmote(token);
      },
    }),
  };
}

export function useEmoteOnHover(container: ComputedRef<HTMLElement>) {
  const emoji = ref<Nullish<string>>();
  const emote = ref<Nullish<IEmote>>();
  const emoteModifiers = ref<Nullish<IEmote[]>>();

  function nullEveryState() {
    emoteModifiers.value = null;
    emote.value = null;
    emoji.value = null;
  }

  function updateHoveredEmoteContainerStyle(event: MouseEvent) {
    const { target } = event;
    assert.ok(target instanceof HTMLElement && container.value);
    const targetRect = target.getBoundingClientRect();
    const top = event.pageY - event.offsetY;
    const left = targetRect.left + targetRect.width / 2;
    container.value.style.top = `${top}px`;
    container.value.style.left = `${left}px`;
    container.value.style.transform = "translate(-50%, -100%)";
  }

  function updateHoveredEmoji(value: string, event: MouseEvent) {
    nullEveryState();
    emoji.value = value;
    updateHoveredEmoteContainerStyle(event);
  }

  function updateHoveredEmote(
    value: IEmote,
    event: MouseEvent,
    findEmoteModifiers?: (tokens: string[]) => IEmote[],
  ) {
    assert.ok(event.target instanceof HTMLImageElement);
    nullEveryState();
    emote.value = value;
    updateHoveredEmoteContainerStyle(event);
    const wrapperElement = findEmoteWrapper(event.target);
    if (!wrapperElement) {
      // NOTE: here hoveredEmojiModifiers MUST be null (and it is, because nullEveryState function is called)
      return;
    }
    assert.ok(isFunction(findEmoteModifiers));
    const modifiersTokens = [...wrapperElement.children]
      .filter(isEmoteModifier)
      .map(getEmoteToken);
    emoteModifiers.value = findEmoteModifiers(modifiersTokens);
  }

  return {
    makeMouseoverHandler(
      options: {
        findEmote?: (
          target: HTMLImageElement,
        ) => MaybePromise<ReturnType<FindEmote>>;
        findEmoteModifiersByTokens?: (tokens: string[]) => IEmote[];
        _findEmojiData?: (
          emoji: string,
        ) => MaybePromise<Record<string, number | string> | undefined>;
      } = {},
    ) {
      return async function (event: Event) {
        assert.ok(event instanceof MouseEvent);
        const { target, relatedTarget, currentTarget } = event;
        if (!(target instanceof Element)) {
          return log("debug", "not an element");
        }
        if (target === currentTarget) {
          nullEveryState();
          return log("debug", "cursor moved away");
        }
        const isWrappedEmoji
          = target instanceof HTMLElement
          && typeof target.dataset.emojiToken === "string";
        if (isWrappedEmoji) {
          return updateHoveredEmoji(target.innerHTML, event);
        }
        if (
          relatedTarget instanceof HTMLImageElement
          && !(
            target instanceof HTMLImageElement
            /* NOTE: target instanceof HTMLInputElement is FIX for collapses-set component, first row in emote set can not trigger hoveredEmote set without this hack    */
            || target instanceof HTMLInputElement
          )
        ) {
          nullEveryState();
          return log("debug", "not an image");
        }
        if (!(target instanceof HTMLImageElement) || !isFn(options.findEmote)) {
          return;
        }
        const emote = await options.findEmote(target);
        if (!emote) {
          return;
        }
        return updateHoveredEmote(
          emote,
          event,
          options.findEmoteModifiersByTokens,
        );
      };
    },
    emote,
    emoji,
    emoteModifiers,
    close: nullEveryState,
  };
}
