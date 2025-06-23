// I need to use Playwright to get shareable PageSpeed Insights reports
// Reports gotten with following API endpoint are not shareable
// https://www.googleapis.com/pagespeedonline/v5/runPagespeed

import { chromium } from "playwright";
import type { Browser, Page } from "playwright";

interface Targets {
  performance: string;
  seo: string;
  accessibility: string;
  practices: string;
}

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

const targets: Targets = {
  performance: "#performance",
  seo: "#seo",
  accessibility: "#accessibility",
  practices: "#best-practices",
};

async function scrapePageSpeedResults(url: string = "https://dav.one"): Promise<CompleteResults> {
  const encodedUrl: string = encodeURIComponent(url);

  const browser: Browser = await chromium.launch({
    headless: true,
  });

  const page: Page = await browser.newPage();

  try {
    console.log("Starting PageSpeed analysis scraping");

    // Navigate to PageSpeed Insights
    await page.goto(`https://pagespeed.web.dev/analysis?url=${encodedUrl}`, {
      timeout: 60000,
      waitUntil: "networkidle",
    });

    console.log("Waiting for analysis to complete");

    // Wait for final URL and results to be ready
    const finalUrl: string = await waitForResultsReady(page);

    // Extract test ID from URL
    const testId: string | null = extractTestId(finalUrl);

    // Extract performance metrics
    const results: ScoreResults = await page.evaluate((targetsObj: Targets): ScoreResults => {
      const scores: ScoreResults = {};

      try {
        Object.entries(targetsObj).forEach(([key, selector]: [string, string]) => {
          const anchor = document.querySelector(`a[href="${selector}"]`);
          if (anchor) {
            const childDivs = anchor.querySelectorAll("div");
            const scoreElement = Array.from(childDivs).find((div) => {
              const text = div.textContent?.trim() || "";
              return !isNaN(Number(text)) && text !== "";
            });

            if (scoreElement) {
              const score = scoreElement.textContent?.trim() || "";
              (scores as Record<string, number>)[key] = Number(score);
            }
          }
        });
      } catch (error) {
        console.error("Error extracting metrics:", error);
      }

      return scores;
    }, targets);

    // Combine results
    const completeResults: CompleteResults = {
      ...results,
      finalUrl: finalUrl,
      testId: testId,
      timestamp: new Date().toISOString(),
    };

    console.log(completeResults);

    await browser.close();
    return completeResults;
  } catch (error) {
    console.error("Error scraping PageSpeed results:", error);
    await browser.close();
    throw error;
  }
}

async function waitForResultsReady(page: Page): Promise<string> {
  let attempts: number = 0;
  const maxAttempts: number = 120; // 2 minutes max wait

  while (attempts < maxAttempts) {
    const currentUrl: string = page.url();

    // Check if URL contains the results pattern
    const hasResultsPattern: boolean = /\/analysis\/[-a-zA-Z0-9]+\//.test(currentUrl);

    if (hasResultsPattern) {
      // Check if anchor elements with score hrefs are loaded
      const scoreAnchorsLoaded: boolean = await page.evaluate((targetsObj: Targets): boolean => {
        let loadedCount: number = 0;

        for (const target in targetsObj) {
          const anchor = document.querySelector(`a[href="${targetsObj[target as keyof Targets]}"]`);
          if (anchor) {
            loadedCount++;
          }
        }

        return loadedCount > 0;
      }, targets);

      if (scoreAnchorsLoaded) {
        console.log("Results are ready");
        return currentUrl;
      }
    }

    await page.waitForTimeout(1000);
    attempts++;
  }

  // Fallback
  const finalUrl: string = page.url();
  console.warn("Timeout reached, using current URL:", finalUrl);
  return finalUrl;
}

function extractTestId(url: string): string | null {
  // Example URL: https://pagespeed.web.dev/analysis/https-dav-one/vepqepoajh?form_factor=mobile
  const regex: RegExp = /[^/?]+(?=\?|$)/;
  const match: RegExpMatchArray | null = url.match(regex);

  if (match && match[0]) {
    return match[0];
  }

  console.warn("Could not extract test ID from URL:", url);
  return null;
}

// await scrapePageSpeedResults();

export { scrapePageSpeedResults };
// export type { CompleteResults, ScoreResults, Targets };
