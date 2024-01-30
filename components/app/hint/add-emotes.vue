<template>
  <div class="flex flex-col rounded-b-btn border-2 px-2">
    <span>
      Showing pastas with only
      <nuxt-link
        :to="{
          path: '/collections/global',
          hash: '#heading',
        }"
        class="link"
      >
        global emotes
      </nuxt-link>
    </span>
    <span>
      Add
      <nuxt-link
        :to="{
          path: '/collections',
          query: {
            'focus-fetch-input': 'true',
          },
          hash: '#heading',
        }"
        class="link"
      >
        user emotes
      </nuxt-link>
    </span>
  </div>
</template>
