// TODO: make it as macro
/// import { withBemBlock } from 'path' with { type: 'macros' }
// this syntax is valid, but it will be just regular import, not macros
// should use vite plugin
export function withBem(block: string) {
  return {
    block,
    element(name: string) {
      return `${block}__${name}`;
    },
  };
}
