import type { NotificationColor, TranslateFn } from "~/utils/toast/common";

type RaiseReason_ = string | Error | undefined;

type RaiseReason = RaiseReason_ | (() => RaiseReason_);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assertIsError<EC extends new (...args: any[]) => Error>(
  maybeError: unknown,
  ErrorConstructor?: EC,
): asserts maybeError is InstanceType<EC> {
  if (!(maybeError instanceof (ErrorConstructor || Error))) {
    throw new TypeError("Expected an error");
  }
}

function assertOk(value: unknown, reason?: RaiseReason): asserts value {
  if (!value) {
    const maybeErrorLike = typeof reason === "function" ? reason() : reason;
    raise(maybeErrorLike);
  }
}

export function assertNeverEver(
  value: unknown,
  reason?: RaiseReason,
): asserts value {
  if (!value) {
    const maybeErrorLike = typeof reason === "function" ? reason() : reason;
    raise(maybeErrorLike);
  }
}

function assertResponseOk(
  response: Response,
  messageOrError: string | Error = new Error(
    `HTTP error, status = ${response.status} error: ${response.text()}`,
  ),
) {
  if (!response.ok) {
    raise(messageOrError);
  }
}

export const assert: {
  fail: typeof raise;
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
  fail: raise,
};

export function raise(messageOrError?: string | Error): never {
  if (typeof messageOrError === "string") {
    /* eslint-disable-next-line unicorn/prefer-type-error */
    throw new Error(messageOrError);
  } else if (messageOrError instanceof Error) {
    throw messageOrError;
  } else {
    /* eslint-disable-next-line unicorn/prefer-type-error */
    throw new Error("Assertion failed");
  }
}

export class ExtendedError extends Error {
  description: string;
  title?: string;
  color: NotificationColor;
  timeout: number;
  mustAddLocale: boolean;
  tDescriptionInterpolations?: Record<string, unknown>;

  constructor(
    description: string,
    {
      title,
      color = "red",
      timeout = 5000,
      mustAddLocale = false,
      tDescriptionInterpolations,
    }: {
      title?: string;
      color?: NotificationColor;
      timeout?: number;
      mustAddLocale?: boolean;
      tDescriptionInterpolations?: Record<string, unknown>;
    } = {},
  ) {
    super(description);
    this.description = description;
    this.title = title;
    this.color = color;
    this.timeout = timeout;
    this.mustAddLocale = mustAddLocale;
    this.tDescriptionInterpolations = tDescriptionInterpolations;
  }

  withAddedLocale(t: TranslateFn) {
    if (!this.mustAddLocale) {
      return new ExtendedError(this.description, {
        ...this,
      });
    }
    return new ExtendedError(
      this.tDescriptionInterpolations
        ? t(this.description, this.tDescriptionInterpolations)
        : t(this.description),
      {
        ...this,
        title: this.title ? t(this.title) : undefined,
        mustAddLocale: false,
      },
    );
  }
}

export function withOkAssert<V>(reason: string) {
  return function (value: V) {
    assertOk(value, reason);
    return value;
  };
}

export function findErrorMessage(reason: unknown, onNotFoundValue: string) {
  if (reason instanceof Error) {
    return reason.message;
  }
  return onNotFoundValue;
}
