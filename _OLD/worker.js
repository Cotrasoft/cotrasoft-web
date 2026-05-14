export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // --- API routes ---
    if (url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ name: "Cloudflare" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- robots.txt ---
    if (url.pathname === "/robots.txt") {
      const robotsTxt = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://cotrasoft.co/sitemap.xml
`;
      return new Response(robotsTxt, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // --- sitemap.xml ---
    if (url.pathname === "/sitemap.xml") {
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://cotrasoft.co/es/</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://cotrasoft.co/es/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://cotrasoft.co/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://cotrasoft.co/es/" />
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://cotrasoft.co/en/</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://cotrasoft.co/es/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://cotrasoft.co/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://cotrasoft.co/es/" />
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
      return new Response(sitemapXml, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // --- llms.txt ---
    if (url.pathname === "/llms.txt") {
      const llmsTxt = `# Cotrasoft - Cooperativa de Desarrolladores de Software

> Cotrasoft es una cooperativa de desarrolladores de software con sede en Colombia. Combinamos el modelo cooperativo de economia solidaria con equipos senior potenciados por IA para entregar software de alta calidad.

## Servicios

- **Rescate de MVP**: Auditoria y correccion de MVPs con deuda tecnica critica en sprints de 2 semanas.
- **Desarrollo Acelerado**: Equipos senior colombianos aumentados con IA comprimen ciclos de desarrollo. Software funcional en dias, no meses.
- **Consultoria Tecnica**: Evaluacion de arquitectura, hojas de ruta tecnicas y recomendaciones priorizadas.

## Membresia

Cotrasoft es una cooperativa abierta a desarrolladores colombianos. Los miembros reciben:
- Acceso a creditos cooperativos
- Educacion y capacitacion continua
- Comunidad colaborativa
- Participacion en ganancias y toma de decisiones

## Contacto

- Web: https://cotrasoft.co
- Email: gerencia@cotrasoft.co
- Ubicacion: Colombia

## URLs

- Pagina principal (ES): https://cotrasoft.co/es/
- Main page (EN): https://cotrasoft.co/en/
`;
      return new Response(llmsTxt, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // --- Root redirect (301) ---
    if (url.pathname === "/") {
      const acceptLang = request.headers.get("Accept-Language") || "";
      const lang = /^en/i.test(acceptLang) ? "en" : "es";
      return new Response(null, {
        status: 301,
        headers: {
          Location: `${url.origin}/${lang}/`,
          Vary: "Accept-Language",
          "Cache-Control": "no-cache",
        },
      });
    }

    // --- Static assets with cache headers ---
    const response = await env.ASSETS.fetch(request);

    if (url.pathname.startsWith("/assets/")) {
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }

    // HTML responses: no cache
    if (response.headers.get("Content-Type")?.includes("text/html")) {
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", "public, max-age=0, must-revalidate");
      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }

    return response;
  },
};
