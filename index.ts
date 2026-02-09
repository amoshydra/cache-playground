const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, If-None-Match, If-Modified-Since",
};

const PORT = Bun.env.PORT || 3000;

const server = Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // --- SERVE THE INDEX.HTML FILE ---
    if (path === "/") {
      const file = Bun.file("./index.html"); // Reference the file

      // Check if file exists to prevent server crash
      if (!(await file.exists())) {
        return new Response("Documentation file not found", { status: 404 });
      }

      return new Response(file, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html",
        },
      });
    }


    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }


    // Dynamic content to test if we are getting a "fresh" or "cached" response
    const content = `Timestamp: ${new Date().toISOString()}\nPath: ${path}`;
    const etag = `W/"${Bun.hash(content).toString(16)}"`; // Weak ETag
    const lastModified = "Mon, 01 Jan 2026 00:00:00 GMT";

    // 1. Check for Revalidation (Conditional Requests)
    const ifNoneMatch = req.headers.get("if-none-match");
    const ifModifiedSince = req.headers.get("if-modified-since");

    if (ifNoneMatch === etag || ifModifiedSince === lastModified) {
      console.log(`[304] Revalidated: ${path}`);
      return new Response(null, { status: 304 });
    }

    // 2. Define Scenarios
    const scenarios: Record<string, Record<string, string>> = {
      "/cache/no-store": {
        "Cache-Control": "no-store",
        "X-Note": "Browser must not store this at all."
      },
      "/cache/no-cache": {
        "Cache-Control": "no-cache",
        "ETag": etag,
        "X-Note": "Store it, but always revalidate before using."
      },
      "/cache/immutable": {
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Note": "Never revalidate, even on refresh."
      },
      "/cache/stale-while-revalidate": {
        "Cache-Control": "public, max-age=5, stale-while-revalidate=15",
        "X-Note": "Fresh for 5s, served stale for 15s while updating in background."
      },
      "/cache/must-revalidate": {
        "Cache-Control": "public, max-age=10, must-revalidate",
        "X-Note": "Once stale (after 10s), it MUST NOT use the cache without checking server."
      },
      "/cache/private": {
        "Cache-Control": "private, max-age=60",
        "X-Note": "Only the end-user browser can cache, not CDNs."
      },
      "/cache/vary-ua": {
        "Cache-Control": "public, max-age=60",
        "Vary": "User-Agent",
        "X-Note": "Cache varies based on the browser type."
      },
      "/cache/last-modified": {
        "Cache-Control": "no-cache",
        "Last-Modified": lastModified,
        "X-Note": "Testing time-based revalidation."
      }
    };


    const headers = scenarios[path] || { "Cache-Control": "no-cache" };
    console.log(`[200] Serving: ${path}`);

    const wait = (duration: number) => new Promise((r) => setTimeout(r, duration));

    await wait(300);

    return new Response(content, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain",
        ...headers,
      }
    });
  },
});

console.log(`🚀 Comprehensive Cache Lab running at http://localhost:${PORT}`);
