declare namespace ITwitch {
  export type Channel = {
    readonly id: string;
    /** NOTE: login was string, became Lowercase<string> */
    readonly login: Lowercase<string>;
    readonly nickname: string;
    readonly thumbnailUrl: string;
    readonly gameName: string;
    readonly tags: string[];
    readonly isLive: boolean;
    readonly title: string;
    readonly startedAt: string;
    isExact?: boolean;
  } & (
    | { isLive: true }
    | {
        isLive: false;
        readonly title: "";
        readonly startedAt: "";
      }
  );
}
