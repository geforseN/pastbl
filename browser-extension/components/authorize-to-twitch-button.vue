<template>
  <a
    :href="config.pastbl.auth.twitch.path"
    target="_blank"
    class="btn btn-primary"
  >
    <!-- TODO: i18n browser extension api -->
    Login with Twitch
  </a>
</template>
<script setup lang="ts">
import { config } from "@/utils/config";
</script>
