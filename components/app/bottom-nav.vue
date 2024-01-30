<template>
  <!-- NOTE: z-index is necessary to keep below links more important  -->
  <nav class="btm-nav btm-nav-md z-10 gap-0 go-brr:hidden">
    <ol class="contents">
      <li class="w-1/2">
        <nuxt-link
          class="btn btn-ghost h-16 w-full flex-nowrap rounded-none border-0 border-twitch bg-twitch/10 text-twitch hover:bg-twitch/20"
          to="/collections"
          active-class="border-t-2 border-t-twitch"
        >
          <span class="w-min break-words uppercase xs:w-auto">
            look emotes
          </span>
          <span class="flex gap-1">
            <emote-integration-logo-square />
          </span>
        </nuxt-link>
      </li>
      <li class="w-1/2">
        <nuxt-link
          class="btn btn-info h-16 w-full rounded-none border-0 bg-info/10 uppercase text-info hover:bg-info/20"
          to="/pastas/find#heading"
          active-class="border-t-2 border-t-info"
        >
          <span>find pasta</span>
          <span class="text-lg">🔍</span>
        </nuxt-link>
      </li>
    </ol>
  </nav>
</template>
