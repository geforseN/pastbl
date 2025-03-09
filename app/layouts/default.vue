<template>
  <div
    class="go-brr:flex-row go-brr:items-start mt-2 flex flex-col items-center justify-center gap-x-12 gap-y-4"
  >
    <slot />
    <slot name="leftColumn">
      <pastas-tabs />
    </slot>
  </div>
</template>
<style>
.chat-pasta-list {
  max-height: 50dvh;
  min-width: 342px;
}

@media (min-width: 890px) {
  .chat-pasta-list {
    max-height: 60dvh;
    min-width: 416px;
  }
}

.scrollbar-gutter-stable {
  scrollbar-gutter: stable;
}
</style>
