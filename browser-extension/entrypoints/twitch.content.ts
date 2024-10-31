import { consola } from "@/utils/consola";
import "@/assets/index.css";
import PastblApp from "@/components/pastbl-app.vue";

const xConsola = consola.withTag("twitch");

function createPastblContainer() {
  const id = "pastbl";
  const element = document.createElement("div");
  element.id = id;
  element.classList.add("absolute", "z-50", "bottom-[10px]", "-left-[330px]");
  return {
    element,
    selector: "#" + id,
  };
}

function doMagic(chatInput: HTMLElement) {
  const container = createPastblContainer();
  // setTimeout(() => {
  chatInput.prepend(container.element);
  createApp(PastblApp).mount(container.selector);
  // }, 1000/* TODO: REMOVE MAGIC NUMBER */);
}

export default defineContentScript({
  matches: ["*://*.twitch.tv/*"],
  main(_context) {
    consola.success("content script loaded");
    let count = 0;
    const chatInputInterval = _context.setInterval(() => {
      const chatInput = document.querySelector(".chat-input");
      if (count > 20/* FIXME: MAGIC NUMBER */) {
        xConsola.error("chat input not found", { count });
        return clearInterval(chatInputInterval);
      }
      if (!chatInput || !(chatInput instanceof HTMLElement)) {
        count++;
        return xConsola.warn("chat input not found");
      }
      clearInterval(chatInputInterval);
      doMagic(chatInput);
    }, 500/* FIXME: MAGIC NUMBER */);
  },
});
