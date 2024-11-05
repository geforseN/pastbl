<template>
  <a
    :href="config.pastbl.auth.twitch.path"
    target="_blank"
    class="btn btn-primary"
  >
    {{ $t('loginWithTwitch') }}
  </a>
</template>
<script setup lang="ts">
import { config } from "~/utils/config";
</script>
