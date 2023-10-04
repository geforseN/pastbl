export default class ExtendedError extends Error {
  description: string;
  title?: string;
  color: string;
  timeout: number;
  constructor(
    message: string,
    {
      title,
      color = "red",
      timeout = 5_000,
    }: { title?: string; color?: string; timeout?: number } = {},
  ) {
    super(message);
    this.description = message;
    this.title = title;
    this.color = color;
    this.timeout = timeout;
  }
}
