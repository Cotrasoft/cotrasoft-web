export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ name: "Cloudflare" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Server-side language redirect for root path
    if (url.pathname === "/") {
      const acceptLang = request.headers.get("Accept-Language") || "";
      const lang = /^en/i.test(acceptLang) ? "en" : "es";
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${url.origin}/${lang}/`,
          Vary: "Accept-Language",
          "Cache-Control": "no-cache",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
