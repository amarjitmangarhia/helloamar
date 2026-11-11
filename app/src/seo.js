// Public SEO files: robots.txt, sitemap.xml, favicon.
const FAVICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#2437d9"/><text x="24" y="34" text-anchor="middle" font-family="Georgia,serif" font-size="30" font-weight="700" fill="#ffffff">A</text></svg>';
const out = (body, type) => new Response(body, { headers: { 'content-type': type, 'cache-control': 'public, max-age=3600' } });

export function handleSeo(p, env) {
  const base = String(env.SITE_URL || 'https://helloamar.com').replace(/\/$/, '');
  if (p === '/robots.txt') return out(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /img/\n\nSitemap: ${base}/sitemap.xml\n`, 'text/plain; charset=utf-8');
  if (p === '/sitemap.xml') return out(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/</loc></url>\n</urlset>\n`, 'application/xml; charset=utf-8');
  if (p === '/googlef1becaac67ac7f80.html') return out('google-site-verification: googlef1becaac67ac7f80.html', 'text/html; charset=utf-8');
  if (p === '/favicon.svg') return out(FAVICON, 'image/svg+xml');
  return null;
}
