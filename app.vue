<template>
  <div>
    <Head>
      <Link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <Link rel="manifest" href="/site.webmanifest" />
    </Head>
    <Body lang="en">
      <div class="relative grid grid-rows-layout">
        <app-top-nav />
        <nuxt-layout>
          <nuxt-page />
        </nuxt-layout>
        <app-bottom-nav />
        <u-notifications>
          <template #title="{ title }">
            <span class="text-xl">{{ title }}</span>
          </template>
          <template #description="{ description }">
            <span class="font-bold">{{ description }}</span>
          </template>
        </u-notifications>
      </div>
      <app-hint-on-hover
        ref="onHoverHintRef"
        :emote="hoveredEmote"
        :emoji="hoveredEmoji"
        :emote-modifiers="hoveredEmojiModifiers"
        @close="nullEveryState"
      />
    </Body>
  </div>
</template>
<script setup lang="ts">
import { savePastasToFile } from "./pages/pastas/index.vue";
import type { AppHintOnHover } from "#build/components";
import {
  findEmoteWrapper,
  getEmoteToken,
  isEmoteModifier,
  type IEmote,
} from "~/integrations";
import type { RouteLocation, RouteLocationRaw } from "#vue-router";

const localePath = useLocalePath();

const go = (path: RouteLocation | RouteLocationRaw) =>
  navigateTo(localePath(path));

const handlersMap = new Map([
  ["h", () => go("/")],
  ["p", () => go("/pastas")],
  ["f", () => go("/pastas/find")],
  ["m", () => go("/user/settings")],
  ["e", () => go("/collections")],
  ["s", () => savePastasToFile(usePastasStore().pastas.state)],
]);

onKeyStroke((event) => {
  const { key, altKey } = event;
  if (!altKey || !handlersMap.has(key)) {
    return;
  }
  event.preventDefault();
  const handler = handlersMap.get(key);
  assert.ok(handler instanceof Function);
  return handler();
});

const hoveredEmoji = ref<Nullish<string>>();
const hoveredEmojiModifiers = ref<Nullish<IEmote[]>>();
const hoveredEmote = ref<Nullish<IEmote>>();
const onHoverHintRef = ref<InstanceType<typeof AppHintOnHover>>();
const onHoverHintRefContainer = computed(
  () => onHoverHintRef.value?.hoveredEmoteContainerRef,
);

function updateHoveredEmoteContainerStyle(event: MouseEvent) {
  const { target } = event;
  assert.ok(target instanceof HTMLElement && onHoverHintRefContainer.value);
  const targetRect = target.getBoundingClientRect();
  const top = event.pageY - event.offsetY;
  const left = targetRect.left + targetRect.width / 2;
  onHoverHintRefContainer.value.style.top = `${top}px`;
  onHoverHintRefContainer.value.style.left = `${left}px`;
  onHoverHintRefContainer.value.style.transform = "translate(-50%, -100%)";
}

function updateHoveredEmote(
  value: IEmote,
  event: MouseEvent,
  findEmoteModifiersByTokens?: (tokens: string[]) => IEmote[],
) {
  assert.ok(event.target instanceof HTMLImageElement);
  nullEveryState();
  hoveredEmote.value = value;
  updateHoveredEmoteContainerStyle(event);
  const wrapperElement = findEmoteWrapper(event.target);
  if (!wrapperElement) {
    // NOTE: here hoveredEmojiModifiers MUST be null (and it is, because nullEveryState function is called)
    return;
  }
  assert.ok(isFn(findEmoteModifiersByTokens));
  const modifiersTokens = [...wrapperElement.children]
    .filter(isEmoteModifier)
    .map(getEmoteToken);
  hoveredEmojiModifiers.value = findEmoteModifiersByTokens(modifiersTokens);
}

function updateHoveredEmoji(value: string, event: MouseEvent) {
  nullEveryState();
  hoveredEmoji.value = value;
  updateHoveredEmoteContainerStyle(event);
}

function nullEveryState() {
  hoveredEmojiModifiers.value = null;
  hoveredEmote.value = null;
  hoveredEmoji.value = null;
}

function makeMouseoverHandler(
  options: {
    findEmote?: (target: HTMLImageElement) => MaybePromise<IEmote | undefined>;
    findEmoteModifiersByTokens?: (tokens: string[]) => IEmote[];
    findEmojiData?: (
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
    if (target instanceof HTMLImageElement && isFn(options.findEmote)) {
      const emote = await options.findEmote(target);
      if (!emote) {
        return;
      }
      return updateHoveredEmote(
        emote,
        event,
        options.findEmoteModifiersByTokens,
      );
    }
    console.log(target);
  };
}

const onHoverHintInject = {
  makeMouseoverHandler,
};

export type InjectOnHoverHint = typeof onHoverHintInject;
provide("hoveredEmote", onHoverHintInject);

onMounted(() => {
  document.documentElement.classList.remove("dark", "light");
});
</script>
<style>
.emote {
  display: inline;
  margin: -5px 0;
}
</style>
