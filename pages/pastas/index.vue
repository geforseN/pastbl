<template>
  <div class="flex w-96 flex-col gap-2">
    <div class="flex flex-col gap-1">
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
          @change="
            (event) => {
              assert.ok(reader);
              loadPastasFromFile(event, reader);
            }
          "
        />
      </article>
    </div>
    <button
      class="btn btn-primary btn-lg h-max flex-nowrap text-balance px-4 text-3xl"
      @click="() => savePastasToFile(pastasStore.pastas.state)"
    >
      <div class="py-1">{{ $t("pastas.saveToFile") }}</div>
      <div class="flex items-center gap-2">
        <span class="text-nowrap text-xs text-base-content">
          <kbd class="kbd pt-1">Alt</kbd>
          <span class="mx-0.5">+</span>
          <kbd class="kbd pt-1">S</kbd>
        </span>
        <icon name="ic:file-download" size="31" />
      </div>
    </button>
    <app-page-link-pastas-find />
    <app-page-link-main />
  </div>
</template>
<script lang="ts">
import { pastasService } from "~/client-only/services";

type MinimalPasta = {
  tags?: string[];
  text: string;
};

function isMinimalPasta(data: unknown): data is MinimalPasta {
  return (
    isObject(data) &&
    typeof data.text === "string" &&
    getTextStatus(data.text) !== "error" &&
    (typeof data.tags === "undefined" || isStringArray(data.tags))
  );
}

function makeMinimalPasta(pasta: IDBMegaPasta) {
  return {
    tags: pasta.tags.length ? pasta.tags : undefined,
    text: pasta.text,
  };
}

function loadPastasFromFile(event: Event, reader: FileReader) {
  assert.ok(reader && event.target);
  const { files } = event.target as unknown as { files: FileList };
  assert.ok(files instanceof FileList);
  reader.readAsText(files[0]);
}

export function savePastasToFile(pastasToSave: IDBMegaPasta[]) {
  const link = document.createElement("a");
  const minimalPastas = pastasToSave.filter(isMinimalPasta).map((pasta) => ({
    ...makeMinimalPasta(pasta),
    createdAt: new Date(pasta.createdAt).toISOString(),
  }));
  const pastasString = JSON.stringify(minimalPastas, null, 2);
  link.href = window.URL.createObjectURL(
    new Blob([pastasString], { type: "application/json" }),
  );
  link.download = "pastas.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getMegaPastasOnFileLoad(event: ProgressEvent<FileReader>) {
  assert.ok(event.target);
  const { result: fileContent } = event.target;
  try {
    assert.ok(typeof fileContent === "string");
    const pastasJson = JSON.parse(fileContent);
    assert.ok(isArray(pastasJson));
    const minimalPastas = pastasJson.filter(isMinimalPasta);
    const megaPastas = minimalPastas.map((pasta) => {
      const trimmedText = megaTrim(pasta.text);
      return createMegaPasta(trimmedText, pasta.tags);
    });
    return megaPastas;
  } catch (error) {
    assert.isError(error);
    throw error;
  }
}
</script>
<script lang="ts" setup>
const pastasStore = usePastasStore();

const reader = process.client ? new FileReader() : null;

if (process.client) {
  assert.ok(reader);
  reader.onload = async function (event) {
    const megaPastas = getMegaPastasOnFileLoad(event);
    const [succeeded, failed] = await tupleSettledPromises(
      megaPastas.map((pasta) => pastasService.add(pasta)),
    );
    pastasStore.pastas.state = [
      ...pastasStore.pastas.state,
      ...succeeded.toSorted((a, b) => a.id - b.id),
    ];
    assert.ok(!failed.length);
  };
}
</script>
