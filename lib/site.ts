export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://deshiyoshad.com";

  return url.replace(/\/+$/, "");
}
