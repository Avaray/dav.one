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
    console.log("Starting PageSpeed analysis scraping...");

    // Navigate to PageSpeed Insights
    await page.goto(`https://pagespeed.web.dev/analysis?url=${encodedUrl}`, {
      timeout: 60000,
      waitUntil: "networkidle",
    });

    console.log("Waiting for analysis to complete...");

    // Wait for final URL with /https-dav-one/ pattern
    const finalUrl = await waitForFinalUrl(page);

    // Extract test ID from URL
    const testId = extractTestId(finalUrl);

    // Wait for the scores section to be fully loaded
    await page.waitForSelector(".lh-scores-header", { timeout: 30000 });
    console.log("Scores section found, extracting data...");

    // Additional wait to ensure all scores are rendered
    await page.waitForTimeout(3000);

    // Extract performance metrics using the new strategy
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
              // Store just the score value directly
              scores[target.substring(1)] = score;
              console.log(`Found ${target.substring(1)}: ${score}`);
            }
          }
        });
      } catch (error) {
        console.error("Error extracting metrics:", error);
      }

      return scores;
    });

    // Combine results with URL and test ID
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

// Updated function to wait for URL with /https-dav-one/ pattern
async function waitForFinalUrl(page) {
  let finalUrl = "";
  let attempts = 0;
  const maxAttempts = 120; // 2 minutes max wait

  console.log("Waiting for URL to contain /https-dav-one/ with test ID...");

  while (attempts < maxAttempts) {
    const currentUrl = page.url();

    // Check if URL contains '/https-dav-one/' and test ID right after it
    const hasCorrectPattern = /\/analysis\/https-dav-one\/([a-zA-Z0-9]+)/.test(currentUrl);

    if (hasCorrectPattern) {
      // Wait a bit more to ensure URL is stable
      await page.waitForTimeout(2000);
      const stableUrl = page.url();

      // Check if URL remained the same (stable)
      if (stableUrl === currentUrl) {
        finalUrl = stableUrl;
        console.log(`URL stabilized after ${attempts} seconds: ${finalUrl}`);
        break;
      }
    }

    if (attempts % 10 === 0) {
      console.log(`Still waiting for final URL... (${attempts}s) Current: ${currentUrl}`);
    }

    await page.waitForTimeout(1000);
    attempts++;
  }

  if (!finalUrl) {
    // Fallback to current URL if we couldn't detect stabilization
    finalUrl = page.url();
    console.warn("Could not detect URL stabilization, using current URL:", finalUrl);
  }

  return finalUrl;
}

// Updated function to extract test ID specifically from /https-dav-one/ pattern
function extractTestId(url) {
  // Example URL: https://pagespeed.web.dev/analysis/https-dav-one/vepqepoajh?form_factor=mobile
  const match = url.match(/\/analysis\/https-dav-one\/([a-zA-Z0-9]+)/);

  if (match && match[1]) {
    return match[1];
  }

  console.warn("Could not extract test ID from URL:", url);
  return null;
}

// await scrapePageSpeedResults();

export { scrapePageSpeedResults };
