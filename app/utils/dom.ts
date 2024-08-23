const parser = import.meta.client ? new DOMParser() : null;

export function createDomElement(string: string) {
  const dom = parser!.parseFromString(string, "text/html");
  return dom.body.firstElementChild;
}
