<template>
  <div class="flex flex-col gap-2">
    <app-page-link to="main" />
    <app-page-link to="find-pasta">
      <template #right>🔍</template>
    </app-page-link>
    <app-page-link to="user-settings">
      <template #right>⚙️</template>
    </app-page-link>
    <app-page-link to="emotes">
      <template #right><emote-integration-logos /></template>
    </app-page-link>
    <div class="flex flex-col gap-1">
      <button
        class="btn btn-primary"
        @click="() => savePastasToFile(pastasStore.pastas.state)"
      >
        Save pastas to file
      </button>
      <article class="form-control rounded-btn border p-2">
        <label for="load-pastas">
          <h3 class="text-xl font-bold">Load pastas</h3>
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

function savePastasToFile(pastasToSave: IDBMegaPasta[]) {
  const link = document.createElement("a");
  const minimalPastas = pastasToSave.filter(isMinimalPasta).map((pasta) => ({
    ...makeMinimalPasta(pasta),
    id: pasta.id,
    createdAt: new Date(pasta.createdAt).toISOString(),
  }));
  link.href = window.URL.createObjectURL(
    new Blob([JSON.stringify(minimalPastas, null, 2)], {
      type: "application/json",
    }),
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
    const [success, failed] = await tupleSettledPromises(
      megaPastas.map((pasta) => pastasService.add(pasta)),
    );
    pastasStore.pastas.state = [
      ...pastasStore.pastas.state,
      ...success.toSorted((a, b) => a.id - b.id),
    ];
    assert.ok(!failed.length);
  };
}
</script>
