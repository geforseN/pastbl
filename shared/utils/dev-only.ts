let consolaPromise: Promise<typeof import("consola")>;

export function log<
  T extends import("consola").LogType,
>(...args: [type: T, key: string, value?: Record<string, unknown>]) {
  if (import.meta.dev) {
    const [type, key, value] = args;
    consolaPromise ??= import("consola");
    consolaPromise.then(({ consola }) => {
      consola[type](key, value);
    });
  }
}
