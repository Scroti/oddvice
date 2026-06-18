/** Maps the API's canonical English stage label to a localized one.
 * `t` must be scoped to the "stage" namespace. */
export function localizeStage(
  name: string,
  t: (key: string, values?: Record<string, string>) => string,
): string {
  if (name.startsWith("Group ")) {
    return t("group", { letter: name.slice("Group ".length) });
  }
  const map: Record<string, string> = {
    "Group stage": "groupStage",
    "Round of 16": "r16",
    "Quarter-finals": "qf",
    "Semi-finals": "sf",
    "Third place": "third",
    Final: "final",
  };
  const key = map[name];
  return key ? t(key) : name;
}
