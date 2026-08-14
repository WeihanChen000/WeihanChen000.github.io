import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

type SitemapEntry = {
  url: string;
  lastmod?: string;
};

const escapeXML = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

export const GET: APIRoute = async ({ site }) => {
  if (!site) return new Response("Astro.site is required", { status: 500 });

  const posts = (await getCollection("posts", ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const staticPaths = ["/", "/archive/", "/about/", "/friends/"];
  const entries: SitemapEntry[] = [
    ...staticPaths.map((path) => ({ url: new URL(path, site).href })),
    ...posts.map((post) => ({
      url: new URL(`/posts/${post.id}/`, site).href,
      lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
    })),
  ];
  const urls = entries.map(({ url, lastmod }) => [
    "  <url>",
    `    <loc>${escapeXML(url)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : "",
    "  </url>",
  ].filter(Boolean).join("\n")).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
