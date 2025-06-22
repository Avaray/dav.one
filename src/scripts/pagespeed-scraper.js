// I need to use Playwright to get shareable PageSpeed Insights reports
// Reports gotten with CURL are not shareable

import { chromium } from "playwright";

async function scrapePageSpeedResults(url = "https://dav.one") {
  const encodedUrl = encodeURIComponent(url);

  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  try {
    console.log("Starting PageSpeed analysis scraping");

    // Navigate to PageSpeed Insights
    await page.goto(`https://pagespeed.web.dev/analysis?url=${encodedUrl}`, {
      timeout: 60000,
      waitUntil: "networkidle",
    });

    console.log("Waiting for analysis to complete");

    // Wait for final URL and results to be ready
    const finalUrl = await waitForResultsReady(page);

    // Extract test ID from URL
    const testId = extractTestId(finalUrl);

    // Extract performance metrics
    const results = await page.evaluate(() => {
      const scores = {};

      try {
        // Target the four main categories
        const targets = ["#performance", "#seo", "#accessibility", "#best-practices"];

        targets.forEach((target) => {
          const anchor = document.querySelector(`a[href="${target}"]`);
          if (anchor) {
            const scoreElement = anchor.querySelector(".lh-gauge__percentage");

            if (scoreElement) {
              const score = scoreElement.textContent.trim();
              scores[target.substring(1)] = Number(score);
            }
          }
        });
      } catch (error) {
        console.error("Error extracting metrics:", error);
      }

      return scores;
    });

    // Combine results
    const completeResults = {
      ...results,
      finalUrl: finalUrl,
      testId: testId,
      timestamp: new Date().toISOString(),
    };

    console.log("Extracted results:", completeResults);

    await browser.close();
    return completeResults;
  } catch (error) {
    console.error("Error scraping PageSpeed results:", error);
    await browser.close();
    throw error;
  }
}

// Simplified function that waits for both final URL and results availability
async function waitForResultsReady(page) {
  let attempts = 0;
  const maxAttempts = 120; // 2 minutes max wait

  while (attempts < maxAttempts) {
    const currentUrl = page.url();

    // Check if URL contains the results pattern
    const hasResultsPattern = /\/analysis\/[-a-zA-Z0-9]+\//.test(currentUrl);

    if (hasResultsPattern) {
      // Check if results are actually loaded by looking for the scores header
      const scoresHeaderExists = await page.locator(".lh-scores-header").count() > 0;

      if (scoresHeaderExists) {
        return currentUrl;
      }
    }

    await page.waitForTimeout(1000);
    attempts++;
  }

  // Fallback
  const finalUrl = page.url();
  console.warn("Timeout reached, using current URL:", finalUrl);
  return finalUrl;
}

function extractTestId(url) {
  // Example URL: https://pagespeed.web.dev/analysis/https-dav-one/vepqepoajh?form_factor=mobile
  const regex = /[^/?]+(?=\?|$)/;
  const match = url.match(regex);

  if (match && match[0]) {
    return match[0];
  }

  console.warn("Could not extract test ID from URL:", url);
  return null;
}

// await scrapePageSpeedResults();

export { scrapePageSpeedResults };
