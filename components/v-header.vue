<template>
  <header class="navbar h-8 border-b border-b-base-300 p-1">
    <nav class="contents">
      <ul class="contents">
        <li
          class="border-2 border-neutral bg-secondary p-1 text-5xl font-bold text-base-content"
        >
          <nuxt-link class="text-5xl leading-3" to="/">pastbl</nuxt-link>
        </li>
        <li class="ml-2">
          <nuxt-link class="btn btn-primary text-black" to="/collections">
            load emotes
          </nuxt-link>
        </li>
        <li class="ml-2">
          <div class="flex h-12 items-center gap-2 rounded-lg bg-info p-2 pr-1">
            <label
              class="label label-text font-bold uppercase text-info-content"
              for="search-pasta"
            >
              Find Own Pasta
            </label>
            <input
              id="search-pasta"
              class="input input-primary h-11"
              name="search-pasta"
              type="search"
            />
          </div>
        </li>
        <!-- <li>
          <div class="form-control relative">
            <label class="absolute left-2 top-0" for="search-pasta"
              >search pasta</label
            >
            <input
              class="input input-primary"
              id="search-pasta"
              name="search-pasta"
              type="search"
            />
          </div>
        </li> -->
        <li class="ml-auto">
          <select class="select select-bordered" data-choose-theme>
            <option value="">Default theme</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { themeChange } from "theme-change";

onMounted(() => {
  themeChange(false);
  document.documentElement.classList.remove("dark", "light");
});

function showFindInput() {}
</script>
