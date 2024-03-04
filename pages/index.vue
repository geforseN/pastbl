<template>
  <div class="flex flex-col gap-2">
    <keep-alive>
      <pasta-form-collapse />
    </keep-alive>
    <app-page-link-pastas-find />
    <app-page-link-user-settings />
    <app-page-link-emotes />
    <app-page-link to="pastas">
      <template #right>
        <span class="relative">
          <div class="flex items-center gap-2">
            <span class="text-nowrap text-xs">
              <kbd class="kbd pt-1">Alt</kbd>
              <span class="mx-0.5">+</span>
              <kbd class="kbd pt-1">P</kbd>
            </span>
            <icon name="mdi:pasta" size="32" class="-translate-y-0.5" />
          </div>
        </span>
      </template>
    </app-page-link>
  </div>
</template>
<style>
html,
body {
  scrollbar-gutter: stable;
}
</style>
