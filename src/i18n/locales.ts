export const LOCALES = [
  "en",
  "de",
  "pl",
  "ro",
  "es",
  "nl",
  "cs",
  "fr",
  "it",
] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Native language names for the switcher. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  pl: "Polski",
  ro: "Română",
  es: "Español",
  nl: "Nederlands",
  cs: "Čeština",
  fr: "Français",
  it: "Italiano",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
