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
import { pastasIdbService } from "~/client-only/services";

type MiniPasta = {
  tags?: string[];
  text: string;
};

type MinimalPasta = MiniPasta & { createdAt: string };

type AnyPasta = MiniPasta | MinimalPasta;

function isMiniPasta(data: unknown): data is MiniPasta {
  return (
    isObject(data) &&
    typeof data.text === "string" &&
    (typeof data.tags === "undefined" || isStringArray(data.tags))
  );
}

function isMinimalPasta(pasta: MiniPasta): pasta is MinimalPasta {
  const pasta_ = pasta as unknown as { createdAt?: unknown };
  return (
    Object.hasOwn(pasta_, "createdAt") &&
    typeof pasta_.createdAt === "string" &&
    isIsoDate(pasta_.createdAt)
  );
}

function makeSortedAnyPastas(pastas: MiniPasta[]): AnyPasta[] {
  const { hasCreatedAt, noCreatedAt } = groupBy(pastas, (pasta) =>
    isMinimalPasta(pasta) ? "hasCreatedAt" : "noCreatedAt",
  ) as {
    hasCreatedAt: MinimalPasta[];
    noCreatedAt: MiniPasta[];
  };
  return [
    ...hasCreatedAt.toSorted(
      (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
    ),
    ...noCreatedAt,
  ];
}

function makeMiniPasta(pasta: IDBMegaPasta): MiniPasta {
  return {
    tags: pasta.tags.length ? pasta.tags : undefined,
    text: pasta.text,
  };
}

function makeMegaPastas(pastas: AnyPasta[]) {
  return pastas.reduce((pastas, pasta) => {
    const text = megaTrim(pasta.text);
    if (getTextStatus(text) === "error") {
      return pastas;
    }
    const tags = (pasta.tags ?? [])
      .map(megaTrim)
      .filter((tag) => getTagStatus(tag) === "ok");
    const megaPasta = createMegaPasta(text, tags);
    pastas.push(megaPasta);
    return pastas;
  }, [] as MegaPasta[]);
}

function loadPastasFromFile(event: Event, reader: FileReader) {
  assert.ok(reader && event.target);
  const { files } = event.target as unknown as { files: FileList };
  assert.ok(files instanceof FileList);
  reader.readAsText(files[0]);
}

export function savePastasToFile(pastasToSave: IDBMegaPasta[]) {
  const link = document.createElement("a");
  const minimalPastas = pastasToSave.map((pasta) => ({
    ...makeMiniPasta(pasta),
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
    const miniPastas = pastasJson.filter(isMiniPasta);
    const anyPastas = makeSortedAnyPastas(miniPastas);
    const megaPastas = makeMegaPastas(anyPastas);
    return megaPastas;
  } catch (error) {
    assert.isError(error);
    // TODO: add toast to user on error
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
      megaPastas.map((pasta) => pastasIdbService.add(pasta)),
    );
    pastasStore.pastas.state = [
      ...pastasStore.pastas.state,
      ...succeeded.toSorted((a, b) => a.id - b.id),
    ];
    assert.ok(!failed.length);
  };
}
</script>
