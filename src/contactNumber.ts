import site from "../site.json" with { type: "json" };

// These numbers identify the site's own historical sales/contact actions.
// Keep source archives and unrelated third-party phone references intact.
const legacyNumbers = [
  "8336347811",
  "8004435212",
  "8002056106",
  "8174351558",
  "8005500065",
];
const legacyPatterns = legacyNumbers.map(
  (number) =>
    new RegExp(
      `(?<!\\d)(?:\\+?1[\\s().-]*)?\\(?${number.slice(0, 3)}\\)?[\\s.-]*${number.slice(3, 6)}[\\s.-]*${number.slice(6)}(?!\\d)`,
      "g",
    ),
);

export function currentContactText(value: string) {
  return legacyPatterns.reduce(
    (text, pattern) => text.replace(pattern, site.phoneDisplay),
    value,
  );
}

export function currentContactHref(href: string) {
  if (!/^tel:/i.test(href)) return href;
  const number = href.slice(4).replace(/[^0-9]/g, "");
  const national =
    number.length === 11 && number.startsWith("1") ? number.slice(1) : number;
  return legacyNumbers.includes(national) ? `tel:${site.phoneE164}` : href;
}
