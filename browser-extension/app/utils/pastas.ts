import { config } from "~/utils/config";

export type XPasta = {
  id: number;
  text: string;
  publishedAt: string;
  lastUpdatedAt: string | null;
  publicity: string;
  tags: {
    value: string;
  }[];
};

export type GetPastasResponse = {
  pastas: XPasta[];
  cursor: number | null;
};

export type GetPastasFn = (cursor?: Nullish<number>) => Promise<GetPastasResponse>;

function isRecordObject(
  object: unknown,
  options?: { onFalse?: () => void },
): object is Record<string, unknown> {
  const isRecord = typeof object === "object" && object !== null;
  if (!isRecord) {
    options?.onFalse?.();
  }
  return isRecord;
}

function isPasta(object: Record<string, unknown>): object is XPasta {
  return typeof object.id === "number"
    && typeof object.text === "string"
    && typeof typeof object.publishedAt === "string"
    && (object.publicity === "private" || object.publicity === "public")
    && Array.isArray(object.tags)
    && object.tags.every((tag) =>
      tag !== null
      && typeof tag === "object"
      && "value" in tag
      && typeof tag.value === "string",
    );
}

type XPasta2 = Omit<XPasta, "tags"> & { tags: string[] };

function isPasta2(object: Record<string, unknown>): object is XPasta2 {
  return typeof object.id === "number"
    && typeof object.text === "string"
    && typeof typeof object.publishedAt === "string"
    && (object.publicity === "private" || object.publicity === "public")
    && Array.isArray(object.tags)
    && object.tags.every((tag) => typeof tag === "string");
}

export async function fetchPastas(cursor: Nullish<number>) {
  const xConsola = consola.withTag("fetchPastas");
  xConsola.debug("fetching pastas", { cursor });
  const options = config.pastbl.pastas.get;
  const query = !cursor ? "" : `?cursor=${cursor}`;
  const response = await fetch(`${options.path}${query}`, options.init);
  if (!response.ok) {
    if (response.status === 401) {
      throw new NotAuthorizedError();
    } else if (String(response.status).startsWith("5")) {
      throw new ServiceNotAvailableError();
    } else {
      throw new Error(response.statusText);
    }
  }
  const json: unknown = await response.json();
  if (typeof json !== "object" || json === null) {
    throw new Error(`json is not an object, json is ${json}`);
  }
  let pastas: XPasta[] = [];
  if (!("pastas" in json)) {
    xConsola.warn("Expected json to contain pastas", { json });
    pastas = [];
  } else if (Array.isArray(json.pastas)) {
    const parsedPastas = json.pastas
      .filter((value) =>
        isRecordObject(value, {
          onFalse: () => {
            xConsola.warn("Wrong pasta provided", { value });
          },
        }),
      ).filter(isPasta);
    pastas = parsedPastas;
  } else {
    xConsola.warn(
      "Expected json.pastas to be an array",
      { pastas },
    );
    pastas = [];
  }

  const newCursor = "cursor" in json
    ? "cursor" in json
    && typeof json.cursor === "number"
    && Number.isInteger(json.cursor)
    && json.cursor > 0
      ? json.cursor
      : null
    : null;

  return {
    ...json,
    pastas,
    cursor: newCursor,
  };
}

/**
 * @throws {Error} error only, not primitive value
 * @returns {Promise<XPasta>} pasta from database
 */
export async function postPasta(body: {
  text: string;
  tags: string[];
  publicity: string;
}): Promise<XPasta2> {
  try {
    const response = await fetch(config.pastbl.pastas.post.path, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw _postPastaError(response);
    }
    const json = await response.json();
    if (!isRecordObject(json) || !("pasta" in json)) {
      throw _postPastaError(json);
    }
    const { pasta } = json;
    if (!isRecordObject(pasta) || !isPasta2(pasta)) {
      throw _postPastaError(pasta);
    }
    return pasta;
  } catch (error) {
    if (!(error instanceof Error)) {
      throw _postPastaError(error);
    }
    throw error;
  }
}

export function _postPastaError(cause?: unknown) {
  const message = i18n.t("_postPastaError");
  return new Error(message, { cause });
}
