import type { NotificationColor } from "@nuxt/ui/dist/runtime/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assertIsError<EC extends new (...args: any[]) => Error>(
  maybeError: unknown,
  ErrorConstructor?: EC,
): asserts maybeError is InstanceType<EC> {
  if (!(maybeError instanceof (ErrorConstructor || Error))) {
    throw new TypeError("Expected an error");
  }
}

function assertOk(
  value: unknown,
  messageOrError?: string | Error,
): asserts value {
  if (!value) {
    raise(messageOrError);
  }
}

function assertResponseOk(
  response: Response,
  messageOrError: string | Error = Error(
    `HTTP error, status = ${response.status} error: ${response.text()}`,
  ),
) {
  if (!response.ok) {
    if (messageOrError instanceof Error) {
      throw messageOrError;
    }
    throw new Error(messageOrError);
  }
}

export const assert: {
  ok: typeof assertOk;
  isError: typeof assertIsError;
  response: {
    ok: typeof assertResponseOk;
  };
} = {
  ok: assertOk,
  isError: assertIsError,
  response: {
    ok: assertResponseOk,
  },
};

export function raise(messageOrError?: string | Error): never {
  if (typeof messageOrError === "string") {
    // eslint-disable-next-line unicorn/prefer-type-error
    throw new Error(messageOrError);
  } else if (messageOrError instanceof Error) {
    throw messageOrError;
  } else {
    // eslint-disable-next-line unicorn/prefer-type-error
    throw new Error("Assertion failed");
  }
}

export class ExtendedError extends Error {
  description: string;
  title?: string;
  color: NotificationColor;
  timeout: number;

  constructor(
    message: string,
    {
      title,
      color = "red",
      timeout = 5_000,
    }: { title?: string; color?: NotificationColor; timeout?: number } = {},
  ) {
    super(message);
    this.description = message;
    this.title = title;
    this.color = color;
    this.timeout = timeout;
  }
}

// generic is necessary for type inference, this rule is wrong here
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export function withOkAssert<V extends unknown>(reason: string) {
  return function (value: V) {
    assertOk(value, reason);
    return value;
  };
}
