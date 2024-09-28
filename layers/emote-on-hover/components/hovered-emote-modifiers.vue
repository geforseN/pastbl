<template>
  <div
    class="divide h-fit divide-y-2 rounded-r border border-primary bg-base-100"
  >
    <div
      v-for="(modifier, i) of emoteModifiers"
      :key="modifier.token + i"
      class="flex items-center p-1"
    >
      <img
        :src="modifier.url.string"
        :width="modifier.width.value"
        :height="modifier.height.value"
        :alt="modifier.token"
        class="bg-base-200"
        loading="lazy"
      />
      <nuxt-link
        v-if="modifier.integrationLink.canBe()"
        external
        target="_blank"
        class="link line-clamp-2 max-w-48 break-all font-bold"
        :href="modifier.integrationLink.value"
      >
        {{ modifier.token }}
      </nuxt-link>
      <span
        v-else
        class="line-clamp-2 max-w-48 break-all font-bold"
      >
        {{ modifier.token }}
      </span>
      {{ $t("emote.modifier") }}
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  emoteModifiers: IEmote[];
}>();

const emoteModifiers = computed(() =>
  props.emoteModifiers.map((modifier) => EmoteOnHover.create(modifier)),
);
</script>
