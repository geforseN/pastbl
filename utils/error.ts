import type { NotificationColor } from "@nuxt/ui/dist/runtime/types";

export function assertIsError(
  maybeError: unknown,
): asserts maybeError is Error {
  if (maybeError instanceof Error) {
    return;
  }
  throw new Error("Expected an error");
}

export function raise(messageOrError: string | Error): never {
  throw typeof messageOrError === "string"
    ? new Error(messageOrError as string)
    : (messageOrError as Error);
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
