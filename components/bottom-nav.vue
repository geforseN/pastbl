<template>
  <nav class="btm-nav btm-nav-md gap-0 go-brr:hidden">
    <ol class="contents">
      <li class="w-1/2">
        <nuxt-link
          class="btn btn-ghost h-16 w-full flex-nowrap rounded-none border-0 border-twitch bg-twitch/10 text-twitch hover:bg-twitch/20 hover:underline focus:underline"
          to="/collections"
          active-class="border-t-2 border-t-twitch"
        >
          <span class="w-min break-words xs:w-auto">load emotes</span>
          <span class="flex flex-col xs:flex-row">
            <icons-ffz-logo width="24" heigth="24" />
            <icons-bttv-logo
              class="absolute translate-x-6 translate-y-1.5 xs:static xs:translate-x-0 xs:translate-y-0"
              width="24"
              heigth="24"
            />
            <icons-seventv-logo width="24" heigth="24" />
          </span>
        </nuxt-link>
      </li>
      <li class="w-1/2">
        <button
          class="btn btn-info h-16 w-full rounded-none border-0 bg-info/10 text-info hover:bg-info/20"
          for="search-pasta"
          @click="emit('openFindPastaModal')"
        >
          find pasta
          <icons-search width="24" heigth="24" />
        </button>
      </li>
    </ol>
  </nav>
</template>
<script lang="ts" setup>
const emit = defineEmits(["openFindPastaModal"]);
</script>
