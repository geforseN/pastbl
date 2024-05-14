<template>
  <div class="chat-pasta-sidebar h-12 sm:h-8">
    <div
      class="dropdown dropdown-left dropdown-top dropdown-hover !h-8 xs:h-auto"
    >
      <div
        tabindex="0"
        role="button"
        class="btn btn-square btn-primary btn-md w-8 border-2 border-primary-content sm:h-8 sm:!min-h-8 sm:w-12"
      >
        <span class="block sm:hidden">
          <icon name="ic:baseline-more-vert" />
        </span>
        <span class="hidden sm:block">
          <icon name="ic:baseline-more-horiz" />
        </span>
      </div>
      <ul
        tabindex="0"
        class="menu dropdown-content z-[1] flex w-max translate-x-[18%] flex-row flex-wrap gap-1 rounded-btn border border-base-content bg-base-100 p-2 shadow *:w-min sm:translate-x-12"
      >
        <li>
          <nuxt-link-locale to="/" class="btn btn-info flex-nowrap">
            <span v-html="$t('pasta.dropdown.buttons.edit')" />
            <icon name="ic:outline-edit" size="24" class="min-h-6 min-w-6" />
          </nuxt-link-locale>
        </li>
        <li>
          <button class="btn btn-error flex-nowrap">
            <span v-html="$t('pasta.dropdown.buttons.delete')"></span>
            <icon
              name="ic:baseline-delete-outline"
              size="24"
              class="min-h-6 min-w-6"
            />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
