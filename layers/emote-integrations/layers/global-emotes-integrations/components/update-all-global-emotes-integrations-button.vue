<template>
  <button
    class="btn btn-primary btn-lg border-base-content w-full flex-nowrap text-pretty border-2 text-xl"
  >
    {{ $t("collections.global.update-all-emotes") }}
    <div class="border-base-100 bg-base-content rounded border-[3px] p-1 pr-2">
      <emote-integration-logos />
    </div>
  </button>
</template>
