import type { NotificationColor } from "$/toast/utils/-common";

export function findErrorMessage(reason: unknown, onNotFoundValue: string) {
  if (reason instanceof Error) {
    return reason.message;
  }
  return onNotFoundValue;
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
}
