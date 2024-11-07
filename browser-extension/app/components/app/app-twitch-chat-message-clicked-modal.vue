<template>
  <Teleport
    to="#root"
  >
    <div
      v-show="show"
      ref="container"
      v-on-click-outside="() => (show = false)"
      :style
    >
      {{ textToCopy }}
      <button class="btn btn-primary btn-sm">
        Save
      </button>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";
import type { CSSProperties } from "vue";

const container = useTemplateRef("container");

const show = ref(false);
const textToCopy = ref("");

const style = reactive({
  position: "absolute",
  top: "0",
  left: "0",
  zIndex: "10",
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  backgroundColor: "black",
  borderRadius: "5px",
  padding: "10px",
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

function getMessageText(element: Element) {
  const xConsola = consola.withTag("get-message-text");
  if (!(element instanceof HTMLElement)) {
    xConsola.warn("element is not an HTMLElement", { element });
    return "";
  }
  if (element.dataset.aTarget === "chat-message-text") {
    if (element.textContent !== null) {
      return element.textContent;
    }
    xConsola.warn("element is message text, but textContent is null", { element });
  } else if (element.dataset.testSelector === "emote-button") {
    const emote = element.querySelector("img");
    if (emote !== null) {
      return emote.alt;
    }
    xConsola.warn("element is emote button, but emote is null", { element });
  } else {
    xConsola.warn("unknown element", { element });
  }
  return "";
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
      let text = "";
      for (const element of messageBody.children) {
        text += getMessageText(element);
      }
      textToCopy.value = text;
      show.value = true;
      await nextTick();
      consola.debug(event);
      style.top = `${event.clientY - event.offsetY - container.value!.offsetHeight}px`;
      style.left = `${event.clientX}px`;
      consola.info("click handled", { text, messageBody });
    });
  });
});
</script>
