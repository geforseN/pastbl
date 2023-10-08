// LINK: http://facweb.cs.depaul.edu/sjost/it212/documents/ascii-pr.htm
// NOTE: SPACE and DELETE is not included (SPACE === 32, DELETE === 127)
// PROBABLY can drop more charCodes, but no idea which characters are valid for emote name
export function isValidASCIIChar(char: string) {
  const charCode = char.charCodeAt(0);
  return charCode > 32 && charCode < 127;
}

export function isValidToken(string: string) {
  for (const char of string) {
    if (!isValidASCIIChar(char)) {
      return false;
    }
  }
  return true;
}

// NOTE: can use this function instead of isValidToken function, because it easier to read
// NOTE: _isValidToken function unpack all characters from iterator, which isValidToken function does not
export function _isValidToken(token: string) {
  return [...token].every(isValidASCIIChar);
}
