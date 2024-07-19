import type { IKeyValueStorage } from "$/key-value/key-value.abstract";
import type { KeyValueSchema } from "$/key-value/key-value.schema";

export class IndexedDBValue<K extends keyof KeyValueSchema> {
  constructor(
    readonly key: K,
    private readonly storage: IKeyValueStorage,
  ) {}

  get() {
    return this.storage.get(this.key);
  }

  set(value: KeyValueSchema[K]) {
    return this.storage.set(this.key, value);
  }

  static createWithStorage<K extends keyof KeyValueSchema>(
    storage: IKeyValueStorage,
  ) {
    return function (key: K) {
      return new IndexedDBValue(key, storage);
    };
  }
}
