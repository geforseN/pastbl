import { assert } from "../../../../app/utils/assert";
import type { KeyValueSchema } from "../../utils/schema";
import type { WithAppIndexedDB } from "./types";

export class KeyValueIndexedDBStore {
  constructor(private readonly withDatabase: WithAppIndexedDB) {}

  async set<Key extends keyof KeyValueSchema>(
    key: Key,
    value: KeyValueSchema[Key],
  ) {
    await this.withDatabase((database) =>
      database.put("key-value", value, key),
    );
  }

  /**
   * @throws {TypeError} if value is undefined
   */
  async get<K extends keyof KeyValueSchema>(key: K) {
    const value = await this.withDatabase((database) =>
      database.get("key-value", key),
    );
    assert.ok(
      value !== undefined,
      new TypeError("Value in key-value store is undefined"),
    );
    return value as KeyValueSchema[K];
  }
}
