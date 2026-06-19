/**
 * Where-to-bet link for the free pick.
 *
 * TODO: replace with your licensed-operator affiliate link, ideally chosen per
 * region (ONJN-licensed operators in RO, etc.). Keep this server-safe (no
 * client-only APIs) so it can be used from server components too.
 */
export function betUrl(home: string, away: string): string {
  const q = `${home} ${away} odds`;
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}
