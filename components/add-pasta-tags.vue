<template>
  <div class="join">
    <input
      type="text"
      id="add-tag"
      v-model="pastaStore.tag"
      placeholder="Type pasta tag"
      class="input input-bordered join-item w-96"
      minlength="1"
    />
    <button
      class="join-item btn text-3xl"
      @click="
        () => pastaStore.addTagWithClear(pastaStore.tag).catch((err) => console.log(err))
      "
    >
      <span class="inline-flex gap-x-1 items-center">
        +
        <span class="text-sm">add tag</span>
      </span>
    </button>
  </div>
</template>
<script setup lang="ts">
const pastaStore =  usePastaStore()
</script>

<!-- <div class="form-control w-full max-w-xs">
      <label class="label" for="add-tag">
        <span class="label-text">Tag for pasta</span>
        <span class="label-text-alt relative right-12 bg-slate-400 p-1 rounded">
          Add tag
        </span>
      </label>
      <div class="flex relative">
        <input
          type="text"
          id="add-tag"
          v-model="pasta.tag"
          placeholder="Type pasta tag"
          class="input input-bordered w-96 p-3 pr-30"
          minlength="1"
        />
        <button
          class="btn text-3xl absolute right-0"
          @click="
            () =>
              pasta.addTagWithClear(pasta.tag).catch((err) => console.log(err))
          "
        >
          <span class="w-full inline-flex gap-x-1 items-center">
            +
            <span class="text-sm">add tag</span>
          </span>
        </button>
      </div>
      <label class="label">
        <span class="label-text-alt">Tag for pasta</span>
      </label>
    </div> -->
