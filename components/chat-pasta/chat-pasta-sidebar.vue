<template>
  <div
    class="chat-pasta-sidebar flex flex-row-reverse justify-between gap-x-2 gap-y-0.5 xs:flex-col xs:justify-between xs:gap-x-0"
  >
    <button
      class="btn btn-square btn-accent btn-md border-2 border-accent-content text-xs"
      :disabled="!props.isClipboardSupported"
      @click="emit('copy')"
    >
      {{ $t(d + "copy") }}
    </button>
    <div :class="props.dropdownClass">
      <div
        tabindex="0"
        role="button"
        class="btn btn-square btn-primary border-2 border-primary-content xs:btn-xs xs:h-full xs:w-full"
      >
        <icon name="ic:baseline-more-horiz" />
      </div>
      <ul
        tabindex="0"
        class="menu dropdown-content z-[1] flex w-min flex-col gap-1 rounded-btn border border-base-content bg-base-100 p-2 shadow"
      >
        <li>
          <button
            class="btn btn-accent h-max gap-y-0.5"
            :disabled="!props.isClipboardSupported"
            @click="emit('copy')"
          >
            {{ $t(d + "copy") }}
            <icon name="ic:baseline-content-copy" />
          </button>
        </li>
        <li>
          <nuxt-link-locale
            :to="`/pastas/edit/${props.pastaId}`"
            class="btn btn-info h-max w-full gap-y-0.5"
          >
            {{ $t(d + "edit") }}
            <icon name="ic:outline-edit" />
          </nuxt-link-locale>
        </li>
        <li>
          <button
            class="btn btn-error h-max w-full gap-y-0.5"
            @click="emit('delete')"
          >
            {{ $t(d + "delete") }}
            <icon name="ic:baseline-delete-outline" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
const d = "pasta.dropdown.buttons." as const;

const props = defineProps<{
  pastaId: number;
  isClipboardSupported: boolean;
  dropdownClass: string;
}>();

const emit = defineEmits<{
  delete: [];
  copy: [];
}>();
</script>
