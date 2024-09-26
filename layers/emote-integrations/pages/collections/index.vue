<template>
  <div class="w-96 space-y-2">
    <app-link to="emojis">
      <template #right>👀</template>
    </app-link>
    <app-link to="global-emotes">
      <template #right><emote-integration-logos /></template>
    </app-link>
    <app-link to="users-emotes">
      <template #right>
        <img
          class="translate-x-2"
          src="https://cdn.7tv.app/emote/63cec0c12ba67946677a463e/1x.webp"
          alt="buh emote from SevenTV"
          loading="lazy"
          width="45"
        />
      </template>
    </app-link>
    <person-emotes-collection-fetch-form ref="fetch" />
    <persons-emotes-collections-select />
    <app-link-to-main />
  </div>
</template>
<script setup>
import type { PersonEmotesCollectionFetchForm } from "#build/components";

useHead({
  title: "Emotes Collections",
});

const fetchRef =
  useTemplateRef<InstanceType<typeof PersonEmotesCollectionFetchForm>>("fetch");

onMounted(() => {
  const params = useUrlSearchParams<{ focus?: "fetch" }>();
  if (params.focus === "fetch") {
    if (import.meta.dev) {
      // eslint-disable-next-line no-console
      console.debug('pages/collections: "focus-fetch" query param found', {
        focusFetch: params.focus,
      });
    }
    fetchRef.value?.focusInput();
  }
});
</script>
