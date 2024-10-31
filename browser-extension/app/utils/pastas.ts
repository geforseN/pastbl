import type { XPasta } from "~/utils/pastas.store";
import { config } from "~/utils/config";

export async function fetchPastas() {
  const xConsola = consola.withTag("fetchPastas");
  const options = config.pastbl.pastas.get;
  const response = await fetch(options.path, options.init);
  if (!response.ok) {
    throw new NotAuthorizedError();
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

  return { ...json, pastas };
}
