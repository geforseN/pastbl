<template>
  <div>
    <slot :show-actions />
    <div
      v-on-click-outside="closeActions"
      class="absolute"
      :hidden="!pasta_"
      :style="buttonsContainerStyle"
    >
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
        copy
      </button>
      <button
        class="btn btn-primary btn-sm text-xl"
        @click="() => {
          /** FIXME */
        }"
      >
        send
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
import type { XPasta } from "~/utils/pastas.store";
import type { Slot } from "vue";

defineEmits<{
  copy: [];
  send: [];
}>();

defineSlots<{
  default: Slot<{
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
