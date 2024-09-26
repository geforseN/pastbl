<template>
  <div class="space-y-2">
    <client-only>
      <keep-alive>
        <pasta-form-collapse />
      </keep-alive>
    </client-only>
    <nav class="space-y-2">
      <pastas-find-link />
      <settings-link />
      <emotes-and-emojis-link />
      <pastas-link />
    </nav>
  </div>
</template>
<script setup>
useHead({
  title: "Main Page",
});
</script>
