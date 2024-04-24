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
      <ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
        <li><a>Sidebar Item 1</a></li>
        <li><a>Sidebar Item 2</a></li>
      </ul>
    </div>
  </div>
</template>
