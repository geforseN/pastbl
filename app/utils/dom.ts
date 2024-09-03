const parser = import.meta.client ? new DOMParser() : null;

export function createDomElement(string: string) {
  const dom = parser!.parseFromString(string, "text/html");
  return dom.body.firstElementChild;
}

export function tryDispatchEvent(
  name: string,
  target?: { dispatchEvent: (event: Event) => void },
) {
  const event = new CustomEvent<undefined>(name);
  if (import.meta.client && !target) {
    target = document;
  }
  // NOTE: target still can be optional if no target were provided and it is called on server side
  target?.dispatchEvent(event);
  return event;
}
