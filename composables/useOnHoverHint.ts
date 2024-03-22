import {
  findEmoteWrapper,
  getEmoteToken,
  isEmoteModifier,
  type IEmote,
} from "~/integrations";

export function useOnHoverHint(container: ComputedRef<HTMLElement>) {
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
    assert.ok(isFn(findEmoteModifiers));
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
        ) => MaybePromise<IEmote | undefined>;
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
          return withLogSync(null, "not an element");
        }
        if (target === currentTarget) {
          return withLogSync(nullEveryState, "cursor moved away");
        }
        const isWrappedEmoji =
          target instanceof HTMLElement &&
          typeof target.dataset.emojiToken === "string";
        if (isWrappedEmoji) {
          return updateHoveredEmoji(target.innerHTML, event);
        }
        if (
          relatedTarget instanceof HTMLImageElement &&
          !(
            target instanceof HTMLImageElement ||
            /* NOTE: target instanceof HTMLInputElement is FIX for collapses-set component, first row in emote set can not trigger hoveredEmote set without this hack    */
            target instanceof HTMLInputElement
          )
        ) {
          return withLogSync(nullEveryState, "not an image");
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
    onCloseEmit: nullEveryState,
    onClickOutside,
    onMouseleave: nullEveryState,
  };
}
