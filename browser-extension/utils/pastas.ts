import type { ConsolaInstance } from "consola";
import { config } from "@/utils/config";

export async function fetchPastas(consola: ConsolaInstance) {
  consola = consola.withTag("fetchPastas");
  const options = config.pastbl.pastas.get;
  const response = await fetch(options.path, options.init);
  const json: unknown = await response.json();
  if (typeof json !== "object" || json === null) {
    throw new Error(`json is not an object, json is ${json}`);
  }
  let pastas: unknown[] = [];
  if (!("pastas" in json)) {
    consola.warn("Expected json to contain pastas", { json });
    pastas = [];
  } else if (!Array.isArray(json.pastas)) {
    consola.warn(
      "Expected json.pastas to be an array",
      { pastas },
    );
    pastas = [];
  } else {
    pastas = json.pastas;
  }

  return { ...json, pastas };
}
