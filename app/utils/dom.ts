const parser = new DOMParser();

export function createDomElement(string: string) {
  const dom = parser.parseFromString(string, "text/html");
  return dom.body.firstElementChild;
}
