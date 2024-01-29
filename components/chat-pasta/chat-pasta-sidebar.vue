<template>
  <div
    class="chat-pasta-sidebar flex flex-row-reverse justify-between gap-x-2 gap-y-0.5 xs:flex-col xs:justify-between xs:gap-x-0"
  >
    <button
      class="btn btn-square btn-accent btn-md border-2 border-accent-content text-xs"
      :disabled="!isClipboardSupported"
      @click="emit('copy')"
    >
      Copy pasta
    </button>
    <div :class="dropdownClass">
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
            class="btn btn-accent"
            :disabled="!isClipboardSupported"
            @click="emit('copy')"
          >
            Copy pasta
            <icon name="ic:baseline-content-copy" />
          </button>
        </li>
        <li>
          <nuxt-link
            :to="`/pastas/edit/${pastaId}`"
            class="btn btn-info w-full"
          >
            Change pasta
            <icon name="ic:outline-edit" />
          </nuxt-link>
        </li>
        <li>
          <button class="btn btn-error w-full" @click="emit('delete')">
            Delete pasta
            <icon name="ic:baseline-delete-outline" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
const {
  isClipboardSupported,
  pastaId,
  dropdownClass = "dropdown dropdown-bottom dropdown-hover xs:dropdown-end",
} = defineProps<{
  pastaId: number;
  isClipboardSupported: boolean;
  dropdownClass?: string;
}>();

const emit = defineEmits<{
  delete: [];
  copy: [];
}>();
</script>
