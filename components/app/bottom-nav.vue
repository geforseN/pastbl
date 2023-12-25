<template>
  <!-- NOTE: z index is necessary to keep click on click more important that what below link  -->
  <nav class="btm-nav btm-nav-md z-10 gap-0 go-brr:hidden">
    <ol class="contents">
      <li class="w-1/2">
        <nuxt-link
          class="btn btn-ghost h-16 w-full flex-nowrap rounded-none border-0 border-twitch bg-twitch/10 text-twitch hover:bg-twitch/20"
          to="/emotes"
          active-class="border-t-2 border-t-twitch"
        >
          <span class="w-min break-words uppercase xs:w-auto">emotes</span>
          <span class="flex flex-col gap-1 xs:flex-row">
            <icon-emote-integration-logo
              v-for="(source, index) of availableEmoteSources"
              v-once
              :key="source"
              :class="
                index === 1 &&
                'absolute translate-x-6 translate-y-2 xs:static xs:translate-x-0 xs:translate-y-0'
              "
              :source="source"
              width="24"
              heigth="24"
              class="max-h-[24px] text-xs"
            />
          </span>
        </nuxt-link>
      </li>
      <li class="w-1/2">
        <nuxt-link
          class="btn btn-info h-16 w-full rounded-none border-0 bg-info/10 uppercase text-info hover:bg-info/20"
          to="/pastas/find#pasta-search-parameters-heading"
          active-class="border-t-2 border-t-info"
        >
          <span>find pasta</span>
          <span class="text-lg">🔍</span>
        </nuxt-link>
      </li>
    </ol>
  </nav>
</template>
<script lang="ts" setup>
import { availableEmoteSources } from "~/integrations";
</script>
