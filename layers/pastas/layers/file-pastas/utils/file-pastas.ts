type MiniFilePasta = {
  tags?: string[];
  text: string;
};

type MinimalFilePasta = MiniFilePasta & { createdAt: string };

type FilePasta = MiniFilePasta | MinimalFilePasta;

function isMiniPasta(data: unknown): data is MiniFilePasta {
  return (
    isObject(data)
    && typeof data.text === "string"
    && (data.tags === undefined || isStringArray(data.tags))
  );
}

function isMinimalPasta(pasta: MiniFilePasta): pasta is MinimalFilePasta {
  const pasta_ = pasta as unknown as { createdAt?: unknown };
  return (
    Object.hasOwn(pasta_, "createdAt")
    && typeof pasta_.createdAt === "string"
    && isIsoDate(pasta_.createdAt)
  );
}

function makeSortedAnyPastas(pastas: MiniFilePasta[]): FilePasta[] {
  const { hasCreatedAt, noCreatedAt } = groupBy(pastas, (pasta) =>
    isMinimalPasta(pasta) ? "hasCreatedAt" : "noCreatedAt",
  ) as {
    hasCreatedAt: MinimalFilePasta[];
    noCreatedAt: MiniFilePasta[];
  };
  return [
    ...hasCreatedAt.toSorted(
      (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
    ),
    ...noCreatedAt,
  ];
}

function makeMiniPasta(pasta: OmegaPasta): MiniFilePasta {
  return {
    tags: pasta.tags.length > 0 ? pasta.tags : undefined,
    text: pasta.text,
  };
}

function makeMegaPastas(pastas: FilePasta[]) {
  const appConfig = useAppConfig();

  return pastas.reduce((pastas, pasta) => {
    const text = megaTrim(pasta.text);
    if (getTextStatus(text) === "error") {
      return pastas;
    }
    const tags = (pasta.tags ?? [])
      .map(megaTrim)
      .filter((tag) => getTagLengthStatus(tag) === "ok")
      .slice(0, appConfig.pastaTags.count.max);
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

export async function parseMegaPastas(fileContent: string) {
  const pastasJson = JSON.parse(fileContent);
  assert.ok(isArray(pastasJson));
  const miniPastas = pastasJson.filter(isMiniPasta);
  const anyPastas = makeSortedAnyPastas(miniPastas);
  const megaPastas = makeMegaPastas(anyPastas);
  return megaPastas;
}
