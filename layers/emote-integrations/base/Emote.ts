import type { HasSource } from "./_internal";

export type IEmote = HasSource & {
  id: string;
  type: string;
  token: string;
  url: string;

  isListed: boolean;
  isModifier: boolean;
  isWrapper: boolean;
};
