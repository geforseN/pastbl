<template>
  <div
    class="mt-2 flex flex-col items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <slot name="leftColumn">
      <chat-pasta-list />
    </slot>
    <slot />
  </div>
</template>
