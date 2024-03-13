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
