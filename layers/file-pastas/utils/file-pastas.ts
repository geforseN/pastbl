import { pastaTagsCount } from "~~/config/const";

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
    (data.tags === undefined || isStringArray(data.tags))
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

function makeMiniPasta(pasta: OmegaPasta): MiniPasta {
  return {
    tags: pasta.tags.length > 0 ? pasta.tags : undefined,
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
      .filter((tag) => getTagLengthStatus(tag) === "ok")
      .slice(0, pastaTagsCount.max);
    const megaPasta = createMegaPasta(text, tags);
    pastas.push(megaPasta);
    return pastas;
  }, [] as MegaPasta[]);
}

export function savePastasInFile(pastasToSave: OmegaPasta[]) {
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
  document.body.append(link);
  link.click();
  link.remove();
}

export async function parseFileContent(event: Event) {
  assert.ok(event.target);
  const { files } = event.target as unknown as { files: FileList };
  assert.ok(files instanceof FileList);
  const file = files[0];
  assert.ok(file);
  const fileContent = await file.text();
  assert.ok(typeof fileContent === "string");
  return fileContent;
}

// eslint-disable-next-line require-await
export async function parseMegaPastas(fileContent: string) {
  const pastasJson = JSON.parse(fileContent);
  assert.ok(isArray(pastasJson));
  const miniPastas = pastasJson.filter(isMiniPasta);
  const anyPastas = makeSortedAnyPastas(miniPastas);
  const megaPastas = makeMegaPastas(anyPastas);
  return megaPastas;
}
