export function copyText(text: string) {
  navigator.clipboard.writeText(text);
  consola.log("copied", text);
}

export function copyPasta(pasta: XPasta) {
  copyText(pasta.text);
}

export function sendPasta(pasta: XPasta) {
  consola.log("send", pasta.text);
  const input = document.querySelector(".chat-wysiwyg-input__box > .chat-wysiwyg-input__editor");
  if (!input) {
    return consola.withTag("sendPasta").debug("input not found");
  }
  trySaveExistingInputData(input);
  // FIXME: input pasta.text in textarea and send it
  // input.dispatchEvent(new InputEvent("input", {
  //   data: pasta.text,
  //   bubbles: true,
  // }));
  consola.log("send", pasta.text);
}

function trySaveExistingInputData(input: Element) {
  const stringElement = input.querySelector("[data-slate-string=\"true\"]");
  if (!stringElement) {
    return consola.withTag("sendPasta").debug("string element not found");
  }
  const string = stringElement.textContent;
  if (typeof string !== "string") {
    return consola.withTag("sendPasta").debug("string element text content is not a string");
  }
  navigator.clipboard.writeText(string);
  consola.withTag("sendPasta").log("saved existing input in clipboard", { string });
}
