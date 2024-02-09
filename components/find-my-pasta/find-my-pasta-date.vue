<template>
  <section class="collapse collapse-arrow border">
    <input type="checkbox" checked />
    <h2 class="collapse-title text-xl font-bold">Date range</h2>
    <div class="collapse-content !p-2 !pt-0">
      <section class="rounded-btn border border-secondary py-2">
        <h3 class="px-2 text-xl">Created at</h3>
        <div class="flex flex-col gap-1">
          <div class="flex flex-col gap-1">
            <div class="form-control px-2 pb-0">
              <label for="from-123" class="cursor-pointer px-0.5"> From </label>
              <input
                id="from-123"
                name="from-123"
                type="date"
                class="input input-primary"
              />
            </div>
            <div class="form-control p-2 pb-0">
              <label for="to-123" class="cursor-pointer px-0.5"> To </label>
              <input
                id="to-123"
                name="to-123"
                type="date"
                class="input input-primary"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script lang="ts" setup></script>

<style></style>
