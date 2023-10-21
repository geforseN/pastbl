export default function raise(message = ""): never {
  throw new Error(message);
}
