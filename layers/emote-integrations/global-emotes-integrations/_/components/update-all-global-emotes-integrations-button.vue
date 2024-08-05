<template>
  <button
    class="btn btn-primary btn-lg w-full flex-nowrap text-pretty border-2 border-base-content text-xl"
  >
    {{ $t("collections.global.update-all-emotes") }}
    <div class="rounded border-[3px] border-base-100 bg-base-content p-1 pr-2">
      <emote-integration-logos />
    </div>
  </button>
</template>
