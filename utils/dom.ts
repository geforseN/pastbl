const parser = new DOMParser();

export function createDomElement(html: string) {
  const dom = parser.parseFromString(html, "text/html");
  return dom.body.firstElementChild;
}
