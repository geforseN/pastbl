<template>
  <section class="collapse collapse-arrow border">
    <input type="checkbox" />
    <h2 class="collapse-title text-xl font-bold">
      {{ $t("pasta.find.date.heading") }}
    </h2>
    <div class="collapse-content !p-2 !py-0">
      <section class="mb-2 rounded-btn border border-secondary py-2">
        <h3 class="px-2 text-xl">{{ $t("pasta.find.date.createdAt") }}</h3>
        <div class="space-y-1">
          <div class="form-control px-2 pb-0">
            <label for="from-pasta-created-at" class="cursor-pointer px-0.5">
              {{ $t("from") }}
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
              {{ $t("to") }}
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
      </section>
    </div>
  </section>
</template>
<script lang="ts" setup>
const pastaFindStore = usePastaFindStore();
</script>
