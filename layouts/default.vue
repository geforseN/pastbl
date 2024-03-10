<template>
  <div
    class="mt-2 flex flex-col items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <slot name="leftColumn">
      <chat-pasta-list-hints>
        <chat-pasta-list class="w-[420px]" />
      </chat-pasta-list-hints>
    </slot>
    <slot />
  </div>
</template>
