<template>
  <div>
    <slot :show-actions />
    <div
      v-on-click-outside="closeActions"
      class="absolute z-10"
      :hidden="!pasta_"
      :style="buttonsContainerStyle"
    >
      <div class="flex flex-col">
        <button
          class="btn btn-secondary btn-sm text-xl"
          @click="() => {
            if (!pasta_) {
              consola.warn('no pasta_');
            }
            else {
              copyPasta(pasta_)
              closeActions();
            }
          }"
        >
          {{ $t('copy') }}
        </button>
        <button
          class="btn btn-primary btn-sm text-xl"
          @click="sendPastaInChat"
        >
          {{ $t('send') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
import { useBrowserLocation } from "@vueuse/core";

const browserLocation = useBrowserLocation();

async function sendPastaInChat() {
  const message = pasta_.value?.text;
  if (message === undefined) {
    throw new Error("Pasta text is undefined, can not send chat message");
  }
  const login = browserLocation.value.pathname?.replace("/", "");
  if (typeof login !== "string" || login.includes("/")) {
    throw new Error("Failed to send chat message, correct broadcaster login not found");
  }
  const res = await fetch(config.pastbl.chatMessages.post.path, {
    ...config.pastbl.chatMessages.post.init,
    body: JSON.stringify({
      message,
      login,
    }),
  });
  if (!res.ok) {
    throw new Error("response not ok");
  }
  const data = await res.json();
  if (typeof data !== "object" || data === null || !("isSent" in data) || typeof data.isSent !== "boolean") {
    throw new Error("incorrect response");
  }
}

defineSlots<{
  default: VueSlot<{
    showActions: (pasta: XPasta, coords: { x: number; y: number }) => void;
  }>;
}>();

const buttonsContainerStyle = ref({
  left: "0px",
  top: "0px",
});
const pasta_ = ref<XPasta>();

function showActions(pasta: XPasta, coords: { x: number; y: number }) {
  pasta_.value = pasta;
  buttonsContainerStyle.value = {
    left: coords.x + "px",
    top: coords.y + "px",
  };
}

function closeActions() {
  pasta_.value = undefined;
}
</script>
