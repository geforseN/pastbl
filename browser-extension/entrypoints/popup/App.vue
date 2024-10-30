<template>
  <div>
    <twitch-input-container-button
      @click="onButtonClick"
    />
    <teleport to="#pastbl">
      <x-pastas-list
        v-show="isPastasListVisible"
        class="absolute right-0 top-0 z-50 bg-purple-800 p-2 text-white"
        :pastas
        @copy="copyPasta"
        @send="sendPasta"
      />
    </teleport>
  </div>
</template>
<script setup lang="ts">
import TwitchInputContainerButton from "@/components/twitch-input-container-button.vue";
import XPastasList from "@/components/x-pastas-list.vue";

const isPastasListVisible = ref(false);
const openPastasList = () => isPastasListVisible.value = true;

const onButtonClick = () => {
  openPastasList();
  if (pastas.value.length === 0) {
    fetchFirstPastas();
  }
};

function copyPasta(pasta: XPasta) {
  navigator.clipboard.writeText(pasta.text);
  consola.log("copied", pasta.text);
}

function sendPasta(pasta: XPasta) {
  consola.log("send", pasta.text);
  const input = document.querySelector(".chat-wysiwyg-input__box > .chat-wysiwyg-input__editor");
  if (!input) {
    return consola.withTag("sendPasta").debug("input not found");
  }
  trySaveExistingInputData(input);
  input.dispatchEvent(new InputEvent("input", {
    data: pasta.text,
    bubbles: true,
  }));
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

const fetchFirstPastas = async () => {
  try {
    consola.log("clicked pastbl button");
    const json = await fetchPastas();
    pastas.value.push(...json.pastas);
  } catch (error) {
    consola.error(error);
  }
};
</script>
