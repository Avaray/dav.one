// I need to use Playwright to get shareable PageSpeed Insights reports
// Reports gotten with CURL are not shareable

import { chromium } from "playwright";

const targets = {
  performance: "#performance",
  seo: "#seo",
  accessibility: "#accessibility",
  practices: "#best-practices",
};

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
    const results = await page.evaluate((targetsObj) => {
      const scores = {};

      try {
        Object.entries(targetsObj).forEach(([key, selector]) => {
          const anchor = document.querySelector(`a[href="${selector}"]`);
          if (anchor) {
            const childDivs = anchor.querySelectorAll("div");
            const scoreElement = Array.from(childDivs).find((div) => {
              const text = div.textContent.trim();
              return !isNaN(text) && text !== "";
            });

            if (scoreElement) {
              const score = scoreElement.textContent.trim();
              scores[key] = Number(score);
            }
          }
        });
      } catch (error) {
        console.error("Error extracting metrics:", error);
      }

      return scores;
    }, targets);

    // Combine results
    const completeResults = {
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

async function waitForResultsReady(page) {
  let attempts = 0;
  const maxAttempts = 120; // 2 minutes max wait

  while (attempts < maxAttempts) {
    const currentUrl = page.url();

    // Check if URL contains the results pattern
    const hasResultsPattern = /\/analysis\/[-a-zA-Z0-9]+\//.test(currentUrl);

    if (hasResultsPattern) {
      // Check if anchor elements with score hrefs are loaded
      const scoreAnchorsLoaded = await page.evaluate((targetsObj) => {
        let loadedCount = 0;

        for (const target in targetsObj) {
          const anchor = document.querySelector(`a[href="${targetsObj[target]}"]`);
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
