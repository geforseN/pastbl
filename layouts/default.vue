<template>
  <div class="relative">
    <v-header />
    <slot />
    <u-notifications>
      <template #title="{ title }">
        <span class="text-xl">{{ title }}</span>
      </template>
      <template #description="{ description }">
        <span class="font-bold">{{ description }}</span>
      </template>
    </u-notifications>
  </div>
</template>
