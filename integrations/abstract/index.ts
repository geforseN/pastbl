import type { EmoteSource } from "..";

export interface ICool {
  source: EmoteSource;
  formedAt: number;
}

export interface HasSource {
  source: EmoteSource;
}

export interface HasFormedAt {
  formedAt: number;
}
