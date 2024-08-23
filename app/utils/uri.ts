export function fixedEncodeURIComponent(string: string) {
  return encodeURIComponent(string).replaceAll(/[!'()*]/g, (char) => {
    return "%" + (char.codePointAt(0) ?? "").toString(16);
  });
}
