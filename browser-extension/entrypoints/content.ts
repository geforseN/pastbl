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

const chatInputButtonsContainerSelector = ".chat-input__buttons-container";

function getButtonContainer(): HTMLElement | null {
  const container = document.querySelector(chatInputButtonsContainerSelector);
  if (container instanceof HTMLElement) {
    return container;
  }
  return null;
}

export default defineContentScript({
  matches: ["*://*.twitch.tv/*"],
  main() {
    console.log("hello from content script");

    const observer = new MutationObserver(() => {
      const buttonsContainer = getButtonContainer();
      if (buttonsContainer) {
        console.log({ buttonsContainer, where: "MutationObserver" });
        addPastblButton(buttonsContainer);
      }
    });

    const buttonsContainer = getButtonContainer();
    if (buttonsContainer) {
      console.log({ buttonsContainer, where: "Initial Check" });
      addPastblButton(buttonsContainer);
      observer.observe(document.body, { childList: true, subtree: true });
    }
  },
});
