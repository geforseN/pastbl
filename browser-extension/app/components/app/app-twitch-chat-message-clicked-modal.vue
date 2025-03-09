<template>
  <div
    v-show="show"
    ref="container"
    v-on-click-outside="() => (show = false)"
    class="bg-base-100 text-base-content pointer-events-auto absolute z-10 flex flex-col items-center gap-1 rounded p-2"
    :style
  >
    <button
      class="btn btn-primary btn-sm"
      @click="$emit('save', message)"
    >
      {{ $t("save") }}
    </button>
    <button
      class="btn btn-secondary btn-sm"
      @click="copyText(message.text)"
    >
      {{ $t("copy") }}
    </button>
    <button
      v-if="message.nickname"
      class="btn btn-secondary btn-sm h-fit"
      @click="copyText(`${message.nickname}: ${message.text})`)"
    >
      {{ $t("copyWithNickname") }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";
import type { CSSProperties } from "vue";
import { copyText } from "~/utils/active-pasta-actions";

const container = useTemplateRef("container");

defineEmits<{
  save: [message: typeof message];
}>();

const show = ref(false);
const message = reactive({
  text: "",
  nickname: undefined as string | undefined,
  emotesUrls: new Map<string, string>(),
});

// FIXME: make positioning dynamic
const style = reactive({
  bottom: "30px",
  right: "0",
} satisfies CSSProperties);

const { finders: chatMessageBodyFinders } = config.twitch.chatMessagesContainer.messageBody;
function findMessageBodyElement(target: HTMLElement) {
  for (const findMessageBody of chatMessageBodyFinders) {
    const messageBody = findMessageBody(target);
    if (messageBody) {
      return messageBody;
    }
  }
}

function parseMessagePart(element: Element) {
  const xConsola = consola.withTag("get-message-text");
  if (!(element instanceof HTMLElement)) {
    xConsola.warn("element is not an HTMLElement", { element });
  } else if (element.dataset.aTarget === "chat-message-text") {
    if (element.textContent !== null) {
      return { text: element.textContent };
    }
    xConsola.warn("element is message text, but textContent is null", { element });
  } else if (element.dataset.testSelector === "emote-button") {
    const emote = element.querySelector("img");
    if (emote !== null) {
      return {
        text: emote.alt,
        url: emote.src,
      };
    }
    xConsola.warn("element is emote button, but emote is null", { element });
  } else {
    xConsola.warn("unknown element", { element });
  }
  return { text: "" };
}

const {
  maxAttemptCount,
  pollInterval: interval,
} = config.pastbl.contentScript.chatMessages;
const {
  selector: chatMessagesContainerSelector,
} = config.twitch.chatMessagesContainer;
onMounted(() => {
  pollFor({
    maxAttemptCount,
    interval,
    queryFn: () => document.querySelector(chatMessagesContainerSelector),
  }).then((messagesContainer) => {
    consola.success("found message container", messagesContainer);
    if (!messagesContainer) {
      throw new Error("Failed to find messages container");
    }
    useEventListener(messagesContainer, "click", async (event) => {
      consola.info("message container clicked", { event });
      if (!(event instanceof PointerEvent)) {
        throw new TypeError("event is not a PointerEvent");
      }
      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        throw new TypeError("event.target is not an HTMLElement");
      }
      const messageBody = findMessageBodyElement(target);
      if (!messageBody) {
        return consola.info("no message body found", { target: event.target });
      }
      message.emotesUrls.clear();
      let text = "";
      for (const element of messageBody.children) {
        const result = parseMessagePart(element);
        text += result.text;
        if (result.url !== undefined) {
          message.emotesUrls.set(result.text, result.url);
        }
      }
      message.text = text;
      const parent = messageBody.closest(".chat-line__message");
      if (!parent) {
        consola.warn("no parent found", { messageBody });
      }
      if (parent instanceof HTMLElement && parent.dataset.aUser) {
        message.nickname = parent.dataset.aUser;
      } else {
        consola.warn("no parent.dataset.aUser found", { parent });
        message.nickname = undefined;
      }
      show.value = true;
      await nextTick();
      consola.info("click handled", {
        message,
        messageBody,
        container: container.value,
        event,
      });
    });
  });
});
</script>
