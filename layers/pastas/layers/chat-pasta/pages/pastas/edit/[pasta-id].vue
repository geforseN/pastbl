<template>
  <div class="space-y-2">
    <chat-pasta-edit :pasta-id />
    <emotes-and-emojis-link />
    <app-link-to-main />
  </div>
</template>
<script setup lang="ts">
const pastaId = getRouteStringParam("pastaid", Number);

useHead({
  title: "Edit pasta",
});

onErrorCaptured((error) => {
  const error_ = error instanceof NotFoundPastaError
    ? createError({
      statusCode: 404,
      statusMessage: "Local pasta not found",
      message: `Local pasta with id=${pastaId} not found`,
      fatal: true,
    })
    : createError({
      statusCode: 404,
      ...error,
      fatal: true,
    });
  throw error_;
});
</script>
