<template>
  <div class="drawer drawer-end">
    <input id="app-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <slot />
    </div>
    <div class="drawer-side">
      <label
        for="app-drawer"
        aria-label="close sidebar"
        class="drawer-overlay"
      />
      <ul
        class="menu min-h-full w-80 space-y-2 bg-base-200 p-4 pt-1 text-base-content"
      >
        <li>
          <label
            for="app-drawer"
            class="btn btn-square btn-error drawer-button ml-auto"
          >
            <icon name="ic:sharp-close" />
          </label>
        </li>
        <li>
          <app-links-emote-integrations />
        </li>
        <li>
          <app-links-pastas-find />
        </li>
        <li>
          <app-links-user-settings />
        </li>
        <li class="!mt-auto"></li>
        <li>
          <app-theme-select />
        </li>
        <li class="mb-2">
          <app-locale-select />
        </li>
      </ul>
    </div>
  </div>
</template>
