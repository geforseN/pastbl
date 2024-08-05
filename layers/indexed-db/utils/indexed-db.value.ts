export class IndexedDBValue<K extends keyof KeyValueSchema> {
  constructor(
    readonly key: K,
    private readonly repository: IKeyValueRepository,
  ) {}

  get() {
    return this.repository.get(this.key);
  }

  set(value: KeyValueSchema[K]) {
    return this.repository.set(this.key, value);
  }

  static createWithRepository<K extends keyof KeyValueSchema>(
    repository: IKeyValueRepository,
  ) {
    return function (key: K) {
      return new IndexedDBValue(key, repository);
    };
  }
}
