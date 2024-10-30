<template>
  <a
    :href="config.pastbl.auth.path"
    target="_blank"
    class="group btn btn-ghost w-fit flex-nowrap bg-twitch-accent text-base-300 xs:w-auto"
  >
    <span
      class="text-lg/1 group-hover:underline group-hover:decoration-2 group-hover:underline-offset-2"
    >
      <!-- TODO: i18n browser extension api -->
      Auth to Twitch
    </span>
  </a>
</template>
<script setup lang="ts">
import { config } from "@/utils/config";
</script>
