<template>
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
</template>
<script setup lang="ts">
import { pastasService } from "../../../utils/service/singleton";
import { groupAsync } from "../../../../../app/utils/promise";
import { parseMegaPastas, parseFileContent } from "../utils/file-pastas";
import { useLoadPastasFromFileToast } from "../utils/toasts";
import { usePastasStore } from "../../../../../app/stores/usePastasStore";

const pastasStore = usePastasStore();

const toast = useLoadPastasFromFileToast();

async function onFilesInputChange(event: Event) {
  const fileContent = await parseFileContent(event).catch((error) =>
    toast.panic("incorrectFileContent", error),
  );
  const megaPastas = await parseMegaPastas(fileContent).catch(toast.panic);
  const { fulfilled, rejected } = await groupAsync(
    megaPastas.map((pasta) => pastasService.add(pasta)),
  );
  const sorted = fulfilled.toSorted((a, b) => a.id - b.id);
  pastasStore.pastas.push(...sorted);
  toast.success(fulfilled.length);
  if (rejected.length > 0) {
    toast.warning("foundRejected", rejected.length);
  }
}
</script>
