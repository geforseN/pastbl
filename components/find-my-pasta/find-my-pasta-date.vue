<template>
  <section class="collapse collapse-arrow border">
    <input type="checkbox" />
    <h2 class="collapse-title text-xl font-bold">{{ $t(d + "heading") }}</h2>
    <div class="collapse-content !p-2 !py-0">
      <section class="mb-2 rounded-btn border border-secondary py-2">
        <h3 class="px-2 text-xl">{{ $t(d + "createdAt") }}</h3>
        <div class="flex flex-col gap-1">
          <div class="flex flex-col gap-1">
            <div class="form-control px-2 pb-0">
              <label for="from-pasta-created-at" class="cursor-pointer px-0.5">
                {{ $t(d + "from") }}
              </label>
              <input
                id="from-pasta-created-at"
                v-model="pastaFindStore.pastasCreatedAtRange.from"
                :min="pastaFindStore.pastasCreatedAtRange.min"
                :max="
                  pastaFindStore.pastasCreatedAtRange.to ||
                  pastaFindStore.pastasCreatedAtRange.max
                "
                name="from-pasta-created-at"
                type="datetime-local"
                class="input input-primary"
              />
            </div>
            <div class="form-control p-2 pb-0">
              <label for="to-pasta-created-at" class="cursor-pointer px-0.5">
                {{ $t(d + "to") }}
              </label>
              <input
                id="to-pasta-created-at"
                v-model="pastaFindStore.pastasCreatedAtRange.to"
                :min="
                  pastaFindStore.pastasCreatedAtRange.from ||
                  pastaFindStore.pastasCreatedAtRange.min
                "
                :max="pastaFindStore.pastasCreatedAtRange.max"
                name="to-pasta-created-at"
                type="datetime-local"
                class="input input-primary"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { f } from "./find-my-pasta-params.vue";
const d = f + "date.";
const pastaFindStore = usePastaFindStore();
</script>
