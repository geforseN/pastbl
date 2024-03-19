export function toLowerCase(str: string) {
  return str.toLowerCase() as Lowercase<string>;
}

export function megaTrim(str: string) {
  return str
    .replaceAll("\n", " ")
    .trim()
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word.length)
    .join(" ");
}

export function dasherize(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}
