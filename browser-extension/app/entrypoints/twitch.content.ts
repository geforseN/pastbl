import "~/assets/index.css";
import type { ContentScriptContext } from "wxt/client";
import { consola } from "~/utils/consola";
import { pollFor } from "~/utils/poll-for";
import { createVueApp } from "~/utils/create-vue-app";

async function createUI(context: ContentScriptContext) {
  const { maxAttemptCount, pollInterval } = config.pastbl.contentScript;
  const container = await pollFor({
    maxAttemptCount,
    interval: pollInterval,
    queryFn: () => document.querySelector(".chat-room__content > .chat-input"),
  });
  if (!container) {
    throw new Error("Failed to find chat input");
  }
  pollFor({
    maxAttemptCount,
    interval: pollInterval,
    queryFn: () => document.querySelector(".chat-scrollable-area__message-container"),
  }).then((container) => {
    consola.success("found message container", container);
    if (!container) {
      throw new Error("Failed to find messages container");
    }
    container.addEventListener("click", (event) => {
      consola.info("message container clicked", { event });
      if (!(event.target instanceof HTMLElement)) {
        throw new TypeError("event.target is not an HTMLElement");
      }
      const messageBody
        = event.target.querySelector("[data-a-target=\"chat-line-message-body\"]")
        ?? event.target.querySelector("span.message")
        ?? event.target.closest("[data-a-target=\"chat-line-message-body\"]")
        ?? event.target.closest("span.message");
      if (!messageBody) {
        return consola.info("no message body found", { target: event.target });
      }
      let text = "";
      for (const child of messageBody.children) {
        if (!(child instanceof HTMLElement)) {
          consola.info("child is not an HTMLElement", { child });
          continue;
        }
        if (child.dataset.aTarget === "chat-message-text") {
          if (child.textContent === null) {
            consola.info("child is message text, but textContent is null", { child });
          } else {
            text += child.textContent;
          }
        } else if (child.dataset.testSelector === "emote-button") {
          const emote = child.querySelector("img");
          if (emote === null) {
            consola.info("child is emote button, but emote is null", { child });
          } else {
            text += emote.alt;
          }
        } else {
          consola.info("unknown child", { child });
        }
      }
      const rect = event.target.getBoundingClientRect();
      const div = document.createElement("div");
      div.style.top = `${rect.top}px`;
      div.style.left = `${rect.left}px`;
      div.style.position = "absolute";
      div.style.zIndex = "10";
      div.style.backgroundColor = "blue";
      div.style.color = "white";
      div.style.padding = "2px 4px";
      div.style.borderRadius = "4px";
      div.innerHTML = text;
      document.body.querySelector("#root")?.append?.(div);
      div.style.top = `${rect.top - div.offsetHeight}px`;
      consola.info("clicked", text, { div, messageBody });
    }, {
      signal: context.signal,
    });
  });
  return await createShadowRootUi(context, {
    name: "pastbl-ui",
    position: "inline",
    anchor: container,
    onMount(chatInput) {
      consola.log("mounting ui", chatInput);
      const div = document.createElement("div");
      chatInput.append(div);
      div.classList.add(
        "absolute", "pointer-events-none", "-left-[calc(320px+0.75rem)]", "bottom-1.5", "z-40",
      );
      const app = createVueApp();
      app.mount(div);
      return app;
    },
    onRemove(mounted) {
      mounted?.unmount();
    },
  });
}

export default defineContentScript({
  matches: ["*://*.twitch.tv/*"],
  cssInjectionMode: "ui",
  async main(context) {
    consola.success("content script loaded");
    const ui = await createUI(context);
    ui.mount();
  },
});
