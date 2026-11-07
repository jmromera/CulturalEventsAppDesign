/**
 * Serialises structured data for a <script type="application/ld+json"> tag.
 * "<" is escaped so text from the data (titles, descriptions) can never close the tag and inject HTML.
 */
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

export function serializeJsonLd(data: unknown): string {
  const escape = (text: string, char: string, code: string) => text.split(char).join("\\" + "u" + code);
  let json = JSON.stringify(data);
  json = escape(json, "<", "003c");
  json = escape(json, LINE_SEPARATOR, "2028");
  return escape(json, PARAGRAPH_SEPARATOR, "2029");
}
