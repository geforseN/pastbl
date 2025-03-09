<template>
  <div class="form-control rounded-btn border-accent border-2 p-2">
    <label
      for="find-user-emote"
      class="ml-1 cursor-pointer text-xl"
    >
      {{ $t("emote.find") }}
      <icon name="ic:baseline-search" />
    </label>
    <input
      id="find-user-emote"
      type="search"
      name="find-user-emote"
      class="input input-sm input-accent"
    />
  </div>
</template>
