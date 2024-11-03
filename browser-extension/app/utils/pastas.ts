import type { XPasta } from "~/utils/pastas.store";
import { config } from "~/utils/config";
import type { Nullish } from "./types";

export async function fetchPastas(cursor: Nullish<number>) {
  const xConsola = consola.withTag("fetchPastas");
  xConsola.debug("fetching pastas", { cursor });
  const options = config.pastbl.pastas.get;
  const query = !cursor ? "" : `?cursor=${cursor}`;
  const response = await fetch(`${options.path}${query}`, options.init);
  if (!response.ok) {
    if (response.status === 401) {
      throw new NotAuthorizedError();
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
    const parsedPastas = json.pastas.filter((value): value is Record<string, unknown> => {
      const isObject = typeof value === "object" && value !== null;
      if (!isObject) {
        xConsola.warn("Wrong pasta provided", { value });
      }
      return isObject;
    },
    ).filter((object): object is XPasta => {
      return (
        typeof object.id === "number"
        && typeof object.text === "string"
        && typeof typeof object.publishedAt === "string"
        && (object.publicity === "private" || object.publicity === "public")
        && Array.isArray(object.tags)
        && object.tags.every((tag) =>
          tag !== null
          && typeof tag === "object"
          && "value" in tag
          && typeof tag.value === "string",
        )
      );
    });
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
