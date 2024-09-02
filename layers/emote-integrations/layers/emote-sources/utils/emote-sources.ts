export class EmoteSources<T extends string> {
  readonly #set: Set<T> = new Set();

  constructor(private readonly values: T[]) {
    this.#set = new Set(values);
  }

  get count() {
    return this.#set.size;
  }

  *[Symbol.iterator]() {
    yield* this.values;
  }

  has(value: unknown): value is T {
    return this.#set.has(value as T);
  }

  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => U,
    initialValue: U,
  ): U {
    return this.values.reduce(callbackfn, initialValue);
  }

  map<U>(callbackfn: (value: T, index: number, array: T[]) => U) {
    return this.values.map(callbackfn);
  }

  find(
    predicate: (value: T, index: number, values: T[]) => unknown,
  ): T | undefined;
  find<S extends T>(
    predicate: (value: T, index: number, values: T[]) => value is S,
  ): S | undefined;
  find<S extends T>(
    predicate: (value: T, index: number, values: T[]) => value is S,
  ) {
    return this.values.find(predicate);
  }

  get(
    predicate: (value: T, index: number, values: T[]) => unknown,
    error?: Error,
  ): T;
  get<S extends T>(
    predicate: (value: T, index: number, values: T[]) => value is S,
    error?: Error,
  ): S;
  get<S extends T>(
    predicate: (value: T, index: number, values: T[]) => value is S,
    error?: Error,
  ) {
    return this.values.find(predicate) || raise(error);
  }

  filter(predicate: (value: T, index: number, array: T[]) => unknown) {
    return this.values.filter(predicate);
  }

  flatGroupBy<K extends string | number | symbol, V>(
    getKey: (value: T, index: number, array: T[]) => K,
    getValue: (value: T, index: number, array: T[]) => V,
  ) {
    return flatGroupBy(this.values, getKey, getValue);
  }

  flatGroupBySource<V>(getValue: (value: T, index: number, array: T[]) => V) {
    return flatGroupBy(this.values, (source) => source, getValue);
  }
}
