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
      <app-link to="pastas">
        <template #right>
          <span class="relative">
            <div class="flex items-center gap-2">
              <combine-keyboard-keys first="Alt" last="P" />
              <icon name="mdi:pasta" size="32" class="-translate-y-0.5" />
            </div>
          </span>
        </template>
      </app-link>
    </nav>
  </div>
</template>
<script setup lang="ts">
useHead({
  title: "Main Page",
});
</script>
