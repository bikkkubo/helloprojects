const CALLS_ORIGIN = "e2553121.hello-project-jp.pages.dev";
const SHINDAN_ORIGIN = "9e2e937a.hello-project-jp.pages.dev";

function isShindanRoute(pathname) {
  return (
    pathname === "/shindan" ||
    pathname.startsWith("/shindan/") ||
    pathname === "/api/og" ||
    pathname.startsWith("/api/shindan/")
  );
}

function isSharedAssetRoute(pathname) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/__next-on-pages-dist__/")
  );
}

function prefersShindanAsset(request) {
  const referer = request.headers.get("referer") || "";
  return referer.includes("/shindan");
}

function makeUpstreamRequest(request, hostname) {
  const url = new URL(request.url);
  url.hostname = hostname;
  url.protocol = "https:";

  const headers = new Headers(request.headers);
  headers.delete("host");

  return new Request(url, {
    method: request.method,
    headers,
    body: request.body,
    redirect: "manual",
  });
}

function rewriteLocation(response, request) {
  const location = response.headers.get("location");
  if (!location) {
    return response;
  }

  const currentUrl = new URL(request.url);
  const rewrittenHeaders = new Headers(response.headers);

  try {
    const locationUrl = new URL(location, currentUrl);
    if (locationUrl.hostname === CALLS_ORIGIN || locationUrl.hostname === SHINDAN_ORIGIN) {
      locationUrl.hostname = currentUrl.hostname;
      locationUrl.protocol = currentUrl.protocol;
      rewrittenHeaders.set("location", locationUrl.toString());
    }
  } catch {
    return response;
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: rewrittenHeaders,
  });
}

async function fetchFrom(request, hostname) {
  const response = await fetch(makeUpstreamRequest(request, hostname));
  return rewriteLocation(response, request);
}

async function fetchSharedAsset(request) {
  const primary = prefersShindanAsset(request) ? SHINDAN_ORIGIN : CALLS_ORIGIN;
  const fallback = primary === SHINDAN_ORIGIN ? CALLS_ORIGIN : SHINDAN_ORIGIN;

  const response = await fetchFrom(request, primary);
  if (response.status !== 404) {
    return response;
  }

  return fetchFrom(request, fallback);
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (isShindanRoute(url.pathname)) {
      return fetchFrom(request, SHINDAN_ORIGIN);
    }

    if (isSharedAssetRoute(url.pathname)) {
      return fetchSharedAsset(request);
    }

    return fetchFrom(request, CALLS_ORIGIN);
  },
};
