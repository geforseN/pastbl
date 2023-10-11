import type { NotificationColor } from "@nuxt/ui/dist/runtime/types";

export default class ExtendedError extends Error {
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
