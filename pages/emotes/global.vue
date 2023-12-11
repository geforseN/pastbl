<template>
  <div class="flex w-96 flex-col gap-2">
    <global-emotes />
    <div class="rounded-box border-2 px-4 py-2">
      <nuxt-link to="/emotes">
        <span
          class="flex items-center justify-between gap-2 text-3xl font-bold"
        >
          <span class="flex items-center gap-2">
            <icon name="carbon:link" />
            Look for emotes
          </span>
          <div class="flex items-center gap-1">
            <span class="mr-4 flex flex-col gap-1">
              <icon-emote-integration-logo
                v-for="source of availableEmoteSources"
                v-once
                :key="source"
                :class="
                  source === 'BetterTTV' &&
                  'absolute translate-x-4 translate-y-2'
                "
                :source="source"
                width="16"
                heigth="16"
                class="max-h-[16px] text-xs"
              />
            </span>
          </div>
        </span>
      </nuxt-link>
    </div>
    <go-to-main-page />
  </div>
</template>

<script lang="ts" setup>
import { availableEmoteSources } from "~/integrations";
</script>
