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
        <div
          :title="$t('notImplementedYet')"
        >
          <button
            class="btn btn-primary btn-sm text-xl"
            disabled
            @click="() => { /** FIXME */ }"
          >
            {{ $t('send') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";

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
