export function toLowerCase(string: string) {
  return string.toLowerCase() as Lowercase<string>;
}

export function isLowercase(string: string): string is Lowercase<string> {
  return string === toLowerCase(string);
}

export function megaTrim(string: string) {
  return string
    .replaceAll("\n", " ")
    .trim()
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word.length)
    .join(" ");
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toTitleCase(string: string) {
  return string.replaceAll(/\w\S*/g, capitalizeFirstLetter);
}

export function dasherize(string: string) {
  return string
    .replaceAll(/([a-z])([A-Z])/g, "$1-$2")
    .replaceAll(/[\s_]+/g, "-")
    .toLowerCase();
}
