import type * as TEmoteIntegrations from "../../../../shared/types";
import type { HasFormedAt } from "../../../../shared/abstract/types";

export interface IPersonEmoteCollection extends HasFormedAt {
  integrations: TEmoteIntegrations.Person.SettledRecord;
  person: {
    twitch: PersonTwitch;
  };
}
