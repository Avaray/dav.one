// Using the official PageSpeed Insights API v5.
//
// The previous Playwright-based scraping approach broke because Google now
// detects headless browsers on pagespeed.web.dev and blocks analysis (showing
// "Unable to resolve URL" even for live sites). The API is stable and does not
// depend on the UI structure of pagespeed.web.dev.
//
// Trade-off: the API does not store/archive results, so `finalUrl` points to a
// fresh analysis page rather than a specific historical test. This is acceptable
// since pagespeed.web.dev requires a logged-in Google account to access archived
// tests anyway.
//
// API docs: https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed

interface ScoreResults {
  performance?: number;
  seo?: number;
  accessibility?: number;
  practices?: number;
}

interface CompleteResults extends ScoreResults {
  finalUrl: string;
  testId: string | null;
  timestamp: string;
}

async function scrapePageSpeedResults(url: string = "https://dav.one"): Promise<CompleteResults> {
  // import.meta.env is available when this module is imported by Astro during build.
  // process.env serves as a fallback for standalone Bun/Node script usage.
  const apiKey = import.meta.env.GOOGLE_PAGESPEED_KEY || process.env.GOOGLE_PAGESPEED_KEY || "";
  if (!apiKey) {
    console.error("Missing GOOGLE_PAGESPEED_KEY — PageSpeed scores will be 0");
  }

  const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  apiUrl.searchParams.append("url", url);
  if (apiKey) apiUrl.searchParams.append("key", apiKey);
  // Each category must be appended as a separate param (comma-separated does not work)
  apiUrl.searchParams.append("category", "PERFORMANCE");
  apiUrl.searchParams.append("category", "ACCESSIBILITY");
  apiUrl.searchParams.append("category", "BEST_PRACTICES");
  apiUrl.searchParams.append("category", "SEO");

  console.log(`Fetching PageSpeed Insights for: ${url}`);

  const response = await fetch(apiUrl.toString());
  if (!response.ok) {
    throw new Error(`PageSpeed API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const categories = data.lighthouseResult?.categories ?? {};

  // `data.id` is the canonicalized, redirect-resolved URL of the tested page
  const resolvedUrl: string = data.id ?? url;

  // Construct a link that opens pagespeed.web.dev pre-filled with the tested URL.
  // Clicking it runs a fresh analysis — not an archived snapshot.
  const shareableUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(resolvedUrl)}`;

  const results: CompleteResults = {
    performance: Math.round((categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
    practices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
    seo: Math.round((categories.seo?.score ?? 0) * 100),
    finalUrl: shareableUrl,
    testId: null,
    timestamp: new Date().toISOString(),
  };

  console.log("PageSpeed results:", results);
  return results;
}

export { scrapePageSpeedResults };
export type { CompleteResults, ScoreResults };
