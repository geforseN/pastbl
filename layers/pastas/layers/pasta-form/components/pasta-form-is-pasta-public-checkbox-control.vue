<template>
  <pasta-is-public-checkbox-control
    v-model="isPublic"
    :label="$t('pasta.makePublic?')"
    :text="$t(isPublic ? 'yes' : 'no')"
  />
</template>
<script setup lang="ts">
import { PastaIsPublicCheckboxControl } from "$ui";

const isPublic = defineModel<boolean>({ required: true });
</script>
