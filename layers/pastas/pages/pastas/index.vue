<template>
  <div class="w-96 space-y-2">
    <article class="form-control rounded-btn border p-2">
      <label for="load-pastas">
        <h3 class="p-1 pt-0 text-2xl font-bold">
          {{ $t("pastas.loadFromFile") }}
        </h3>
      </label>
      <input
        id="load-pastas"
        name="load-pastas"
        class="file-input file-input-primary"
        type="file"
        accept="application/json"
        @change="onFilesInputChange"
      />
    </article>
    <button
      class="btn btn-primary btn-lg h-max flex-nowrap text-balance px-4 text-3xl"
      @click="() => savePastasInFile(pastasStore.pastasToShow)"
    >
      <div class="py-1">{{ $t("pastas.saveToFile") }}</div>
      <div class="flex items-center gap-2">
        <combine-keyboard-keys class="text-base-content" first="Alt" last="S" />
        <icon name="ic:file-download" size="31" />
      </div>
    </button>
    <app-page-link-pastas-find />
    <app-page-link-main />
  </div>
</template>
<script lang="ts" setup>
import { pastasService } from "~/client-only/services";

const pastasStore = usePastasStore();

const toast = useMyToast();

async function onFilesInputChange(event: Event) {
  const fileContent = await parseFileContent(event);
  const megaPastas = await parseMegaPastas(fileContent).catch((reason) => {
    assert.isError(reason);
    return toast.throw(reason);
  });
  const { fulfilled, rejected } = await groupAsync(
    megaPastas.map((pasta) => pastasService.add(pasta)),
  );
  const sorted = fulfilled.toSorted((a, b) => a.id - b.id);
  pastasStore.pastas.push(...sorted);
  // TODO: add toast.notify('success','pastasLoaded');
  toast._addToast({ title: "OK" });
  assert.ok(
    rejected.length === 0 /* () => { 
      // TODO: add toast.notify('error','somePastasLoadFailed', rejected);
  } */,
  );
}
</script>
