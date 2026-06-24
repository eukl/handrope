const namedEntities: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: "\""
};

export function decodeHtmlEntities(value: string) {
  return value.replace(/&(#(\d+)|#x([0-9a-fA-F]+)|[a-zA-Z]+);/g, (match, entity, decimal, hexadecimal) => {
    if (decimal) {
      const codePoint = Number.parseInt(decimal, 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }

    if (hexadecimal) {
      const codePoint = Number.parseInt(hexadecimal, 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }

    return namedEntities[entity] ?? match;
  });
}
