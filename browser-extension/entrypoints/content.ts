function addPastblButton(buttonContainer: HTMLElement) {
  console.log({
    buttonContainer,
    b: !buttonContainer.querySelector(".pastbl-button"),
  });
  if (buttonContainer && !buttonContainer.querySelector(".pastbl-button")) {
    const button = document.createElement("button");
    button.textContent = "pastbl";
    button.classList.add("pastbl-button");
    button.style.marginRight = "auto"; // чтобы разместить слева
    button.addEventListener("click", () => {
      // Ваша логика кнопки
    });
    buttonContainer.prepend(button);
  }
}

const chatInputButtonsContainerSelector = "chat-input__buttons-container";

function foo() {
  const container = document.querySelector(chatInputButtonsContainerSelector);
  if (!container) {
    throw new Error("container not found");
  }
  if (!(container instanceof HTMLElement)) {
    const error = new Error("container is not HTMLElement");
    error.context = { container };
    throw error;
  }
  return container;
}

export default defineContentScript({
  matches: ["*://*.twitch.tv/*"],
  main() {
    console.log("hello from content script");
    const observer = new MutationObserver(() => {
      console.log("hello from MutationObserver");
      const buttonsContainer = foo();
      console.log({ buttonsContainer, where: "MutationObserver" });
      addPastblButton(buttonsContainer);
    });

    document.addEventListener("DOMContentLoaded", () => {
      console.log("hello from DOMContentLoaded");
      const buttonsContainer = foo();
      console.log({ buttonsContainer, where: "DOMContentLoaded" });
      addPastblButton(buttonsContainer);
      observer.observe(buttonsContainer, { childList: true, subtree: true });
    });
  },
});
