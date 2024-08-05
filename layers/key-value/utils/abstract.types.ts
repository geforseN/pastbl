export interface IKeyValueRepository {
  get<K extends keyof KeyValueSchema>(key: K): Promise<KeyValueSchema[K]>;
  set<K extends keyof KeyValueSchema>(
    key: K,
    value: KeyValueSchema[K],
  ): Promise<void>;
}
