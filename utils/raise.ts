export default function raise(messageOrError: string | Error): never {
  throw typeof messageOrError === "string"
    ? new Error(messageOrError as string)
    : (messageOrError as Error);
}
