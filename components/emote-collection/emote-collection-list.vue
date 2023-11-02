<template>
  <ol class="flex w-full flex-col gap-1 xs:w-96 2xl:w-auto 2xl:flex-row">
    <emote-collection-ffz
      class="min-h-16 2xl:h-max 2xl:w-80"
      :ffz="props.collections.ffz"
    />
    <emote-collection-bttv
      class="min-h-16 2xl:h-max 2xl:w-80"
      :bttv="props.collections.bttv"
    />
    <emote-collection-seventv
      class="min-h-16 2xl:h-max 2xl:w-80"
      :seven-tv="props.collections.sevenTv"
    />
  </ol>
</template>
<script lang="ts" setup>
const props = defineProps<{
  collections: ReturnType<typeof useUserIntegrations>;
}>();
</script>
