export interface IPersonEmoteCollection extends HasFormedAt {
  integrations: TEmoteIntegrations.Person.SettledRecord;
  person: {
    twitch: PersonTwitch;
  };
}
