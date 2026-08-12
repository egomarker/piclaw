import { LOCAL_APP_PUBLIC_ROOT, type ResolvedLocalApp } from "./types.js";
import { validateProxySuffix } from "./validation.js";

export interface ParsedLocalAppPath {
  slug: string;
  suffix: string;
  needsTrailingSlashRedirect: boolean;
}

export function parseLocalAppPublicPath(pathname: string): ParsedLocalAppPath | null {
  if (!pathname.startsWith(`${LOCAL_APP_PUBLIC_ROOT}/`)) return null;
  const rest = pathname.slice(LOCAL_APP_PUBLIC_ROOT.length + 1);
  if (!rest) return null;
  const slashIndex = rest.indexOf("/");
  if (slashIndex < 0) {
    return { slug: rest, suffix: "/", needsTrailingSlashRedirect: true };
  }
  return {
    slug: rest.slice(0, slashIndex),
    suffix: validateProxySuffix(rest.slice(slashIndex) || "/"),
    needsTrailingSlashRedirect: false,
  };
}

export function buildLocalAppUpstreamUrl(
  app: Pick<ResolvedLocalApp, "upstreamOrigin" | "upstreamBasePath">,
  suffix: string,
  search = "",
): URL {
  const cleanSuffix = validateProxySuffix(suffix || "/");
  const base = app.upstreamBasePath === "/" ? "" : app.upstreamBasePath.replace(/\/$/, "");
  const target = new URL(app.upstreamOrigin);
  target.pathname = `${base}${cleanSuffix}` || "/";
  target.search = search;
  target.hash = "";
  return target;
}

export function buildLocalAppPublicPath(slug: string): string {
  return `${LOCAL_APP_PUBLIC_ROOT}/${slug}/`;
}
