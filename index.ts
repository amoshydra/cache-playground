
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || url.pathname.slice(1);

    // We'll return the current time so you can see if the response is "fresh"
    const now = new Date().toLocaleTimeString();
    const body = `Response generated at: ${now}\nMode: ${type || "default"}`;

    let headers: Record<string, string> = { "Content-Type": "text/plain" };

    switch (type) {
      case "no-store":
        // 🚫 Never cache. The browser must fetch from server every single time.
        headers["Cache-Control"] = "no-store";
        break;

      case "no-cache":
        // 🔍 Cache allowed, but browser MUST revalidate with server before using.
        headers["Cache-Control"] = "no-cache";
        break;

      case "max-age":
        // ⏱️ Cache for 60 seconds. Browser won't even ask the server for 1 minute.
        headers["Cache-Control"] = "public, max-age=60";
        break;

      case "private":
        // 👤 Only the browser can cache. Intermediate proxies (CDNs) are forbidden.
        headers["Cache-Control"] = "private, max-age=60";
        break;

      case "stale":
        // ⚡ Serve old version while fetching the new one in the background.
        // Valid for 5s, stale for another 15s.
        headers["Cache-Control"] = "public, max-age=5, stale-while-revalidate=15";
        break;

      case "immutable":
        // 💎 Content will NEVER change. Browser won't revalidate even on page refresh.
        headers["Cache-Control"] = "public, max-age=31536000, immutable";
        break;

      default:
        headers["Cache-Control"] = "no-cache";
    }

    return new Response(body, { headers });
  },
});

console.log(`🚀 Cache test server running at http://localhost:3000`);
